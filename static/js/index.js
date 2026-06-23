document.addEventListener('DOMContentLoaded', function() {
  var revealItems = document.querySelectorAll('.reveal-on-scroll');
  var tokenSlider = document.getElementById('token-slider');
  var tokenSliderLabel = document.getElementById('token-slider-label');
  var tokenSliderValue = tokenSliderLabel ? tokenSliderLabel.querySelector('span') : null;
  var similarityImage = document.getElementById('similarity-token-image');
  var contextImage = document.getElementById('context-token-image');
  var resultImage = document.getElementById('result-token-image');
  var copyBibtexButton = document.querySelector('.copy-bibtex-button');
  var attentionSinkViz = document.querySelector('.attention-sink-viz');
  var videoCarousel = document.querySelector('[data-carousel]');
  var tokenComparison = document.querySelector('[data-token-comparison]');
  var preloadedTokens = {};
  var pendingTokenValue = null;
  var renderedTokenValue = null;
  var imageUpdateFrame = null;
  var preloadTimer = null;
  var preloadIdleHandle = null;
  var isScrubbing = false;
  var carouselInstructions = [
    'Please segment the player wearing green cleats',
    'Who is the woman in the front? Please respond with segmentation mask',
    'Who is the president of the US in this image? Please output segmentation mask',
    'Where is the person wearing a mask? Please respond with a segmentation mask.',
    'Please segment the man celebrating in the image',
    'Could you provide a segmentation mask for the younger of the two people in this image?',
    'Could you provide a segmentation mask for the founder of NVIDIA in this image?',
    'Where is the leader of Samsung in this image? Please respond with a segmentation mask',
    'Can you highlight Zidane with a segmentation mask?',
    'Please identify and segment Ancelotti in this image'
  ];

  function seekVideoToStart(video) {
    try {
      video.currentTime = 0;
    } catch (error) {}
  }

  function playInlineVideo(video, options) {
    if (!video) {
      return;
    }

    video.muted = true;
    video.playsInline = true;
    video.setAttribute('playsinline', '');

    if (!options || options.reset !== false) {
      seekVideoToStart(video);
    }

    var playPromise = video.play();

    if (playPromise && playPromise.catch) {
      playPromise.catch(function() {});
    }
  }

  function waitForVideoFrame(video, timeout) {
    if (video.readyState >= 2) {
      return Promise.resolve();
    }

    return new Promise(function(resolve) {
      var done = false;

      function finish() {
        if (done) {
          return;
        }
        done = true;
        video.removeEventListener('loadeddata', finish);
        video.removeEventListener('canplay', finish);
        resolve();
      }

      video.addEventListener('loadeddata', finish);
      video.addEventListener('canplay', finish);
      window.setTimeout(finish, timeout || 900);
    });
  }

  function updateDotSelection(dots, activeIndex) {
    dots.forEach(function(dot, dotIndex) {
      var isActive = dotIndex === activeIndex;
      dot.classList.toggle('is-active', isActive);
      dot.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });
  }

  function imagePaths(tokenCount) {
    return {
      similarity: './demo/similarity/similarity_' + tokenCount + '.png',
      context: './demo/context/context_' + tokenCount + '.png',
      result: './demo/result/result_' + tokenCount + '.png'
    };
  }

  function preloadToken(tokenCount) {
    if (preloadedTokens[tokenCount]) {
      return;
    }

    preloadedTokens[tokenCount] = [];
    var paths = imagePaths(tokenCount);
    Object.keys(paths).forEach(function(key) {
      var image = new Image();
      preloadedTokens[tokenCount].push(image);
      image.src = paths[key];
    });
  }

  function queueTokenPreload(tokenCount) {
    if (tokenCount >= 32 && tokenCount <= 575) {
      preloadToken(tokenCount);
    }
  }

  function preloadAround(value, radius, step) {
    var tokenCount = Number(value);
    var candidates = [tokenCount];

    for (var offset = step; offset <= radius; offset += step) {
      candidates.push(tokenCount - offset);
      candidates.push(tokenCount + offset);
    }

    candidates.forEach(function(candidate) {
      queueTokenPreload(candidate);
    });
  }

  function schedulePreload(value) {
    if (preloadTimer) {
      window.clearTimeout(preloadTimer);
    }

    if (preloadIdleHandle && 'cancelIdleCallback' in window) {
      window.cancelIdleCallback(preloadIdleHandle);
      preloadIdleHandle = null;
    }

    preloadTimer = window.setTimeout(function() {
      var runPreload = function() {
        preloadAround(value, isScrubbing ? 8 : 18, isScrubbing ? 4 : 3);
      };

      if ('requestIdleCallback' in window) {
        preloadIdleHandle = window.requestIdleCallback(runPreload, { timeout: 450 });
      } else {
        window.setTimeout(runPreload, 0);
      }
    }, isScrubbing ? 120 : 40);
  }

  function updateTokenText(value) {
    var tokenCount = String(value);
    var numericTokenCount = Number(value);

    if (tokenSliderLabel) {
      if (tokenSliderValue) {
        tokenSliderValue.textContent = tokenCount;
      } else {
        tokenSliderLabel.textContent = 'Retain ' + tokenCount + ' Visual Tokens';
      }
    }

    if (tokenSlider) {
      var progress = ((numericTokenCount - 32) / (575 - 32)) * 100;
      tokenSlider.style.setProperty('--slider-progress', progress + '%');
    }
  }

  function renderTokenImages(value) {
    var tokenCount = String(value);

    if (renderedTokenValue === tokenCount) {
      return;
    }

    renderedTokenValue = tokenCount;
    var paths = imagePaths(tokenCount);

    if (similarityImage && similarityImage.getAttribute('src') !== paths.similarity) {
      similarityImage.src = paths.similarity;
    }

    if (contextImage && contextImage.getAttribute('src') !== paths.context) {
      contextImage.src = paths.context;
    }

    if (resultImage && resultImage.getAttribute('src') !== paths.result) {
      resultImage.src = paths.result;
    }
  }

  function flushImageUpdate() {
    imageUpdateFrame = null;

    if (pendingTokenValue !== null) {
      renderTokenImages(pendingTokenValue);
    }
  }

  function updateTokenViewer(value, options) {
    pendingTokenValue = String(value);
    updateTokenText(pendingTokenValue);

    if (options && options.immediate) {
      if (imageUpdateFrame) {
        window.cancelAnimationFrame(imageUpdateFrame);
        imageUpdateFrame = null;
      }
      renderTokenImages(pendingTokenValue);
    } else if (!imageUpdateFrame) {
      imageUpdateFrame = window.requestAnimationFrame(flushImageUpdate);
    }

    schedulePreload(pendingTokenValue);
  }

  if (tokenSlider) {
    tokenSlider.addEventListener('input', function(event) {
      updateTokenViewer(event.target.value);
    });
    tokenSlider.addEventListener('pointerdown', function(event) {
      isScrubbing = true;
      schedulePreload(event.target.value);
    });
    tokenSlider.addEventListener('pointerup', function(event) {
      isScrubbing = false;
      updateTokenViewer(event.target.value, { immediate: true });
    });
    tokenSlider.addEventListener('pointercancel', function(event) {
      isScrubbing = false;
      updateTokenViewer(event.target.value, { immediate: true });
    });
    tokenSlider.addEventListener('focus', function(event) {
      schedulePreload(event.target.value);
    });
    tokenSlider.addEventListener('change', function(event) {
      isScrubbing = false;
      updateTokenViewer(event.target.value, { immediate: true });
    });
    updateTokenViewer(tokenSlider.value, { immediate: true });
  }

  if (copyBibtexButton) {
    copyBibtexButton.addEventListener('click', function() {
      var targetId = copyBibtexButton.getAttribute('data-copy-target');
      var target = targetId ? document.getElementById(targetId) : null;

      if (!target) {
        return;
      }

      var text = target.textContent;
      var originalText = copyBibtexButton.querySelector('span:last-child').textContent;

      function markCopied() {
        copyBibtexButton.classList.add('is-copied');
        copyBibtexButton.querySelector('span:last-child').textContent = 'Copied';
        window.setTimeout(function() {
          copyBibtexButton.classList.remove('is-copied');
          copyBibtexButton.querySelector('span:last-child').textContent = originalText;
        }, 1600);
      }

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(markCopied);
        return;
      }

      var textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.setAttribute('readonly', '');
      textarea.style.position = 'absolute';
      textarea.style.left = '-9999px';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      markCopied();
    });
  }

  if (attentionSinkViz) {
    var attentionHotspots = attentionSinkViz.querySelectorAll('.attention-token, .attention-flow, .attention-arrowhead, .attention-hit');
    var attentionItems = attentionSinkViz.querySelectorAll('[data-attention-target]');

    function targetMatches(itemTarget, activeTarget) {
      return itemTarget && itemTarget.split(' ').indexOf(activeTarget) !== -1;
    }

    function setAttentionTarget(activeTarget) {
      attentionSinkViz.classList.add('is-focused');
      attentionItems.forEach(function(item) {
        var itemTarget = item.getAttribute('data-attention-target');
        item.classList.toggle('is-active', targetMatches(itemTarget, activeTarget));
      });
    }

    function clearAttentionTarget() {
      attentionSinkViz.classList.remove('is-focused');
      attentionItems.forEach(function(item) {
        item.classList.remove('is-active');
      });
    }

    attentionHotspots.forEach(function(hotspot) {
      hotspot.addEventListener('mouseenter', function() {
        setAttentionTarget(hotspot.getAttribute('data-attention-target'));
      });
      hotspot.addEventListener('focus', function() {
        setAttentionTarget(hotspot.getAttribute('data-attention-target'));
      });
      hotspot.addEventListener('mouseleave', clearAttentionTarget);
      hotspot.addEventListener('blur', clearAttentionTarget);
    });

    window.setTimeout(function() {
      attentionSinkViz.classList.add('has-loaded');
    }, 120);
  }

  if (videoCarousel) {
    var carouselSlides = Array.prototype.slice.call(videoCarousel.querySelectorAll('[data-carousel-slide]'));
    var carouselDots = Array.prototype.slice.call(videoCarousel.querySelectorAll('[data-carousel-dot]'));
    var carouselPrev = videoCarousel.querySelector('[data-carousel-prev]');
    var carouselNext = videoCarousel.querySelector('[data-carousel-next]');
    var carouselInstruction = videoCarousel.querySelector('[data-carousel-instruction]');
    var activeCarouselIndex = 0;

    function setCarouselSlide(index) {
      if (!carouselSlides.length) {
        return;
      }

      activeCarouselIndex = (index + carouselSlides.length) % carouselSlides.length;

      carouselSlides.forEach(function(slide, slideIndex) {
        var isActive = slideIndex === activeCarouselIndex;
        var video = slide.querySelector('video');
        slide.classList.toggle('is-active', isActive);
        slide.setAttribute('aria-hidden', isActive ? 'false' : 'true');

        if (video) {
          if (isActive) {
            playInlineVideo(video);
          } else {
            video.pause();
          }
        }
      });

      updateDotSelection(carouselDots, activeCarouselIndex);

      if (carouselInstruction) {
        carouselInstruction.textContent = carouselInstructions[activeCarouselIndex] || '';
      }
    }

    if (carouselPrev) {
      carouselPrev.addEventListener('click', function() {
        setCarouselSlide(activeCarouselIndex - 1);
      });
    }

    if (carouselNext) {
      carouselNext.addEventListener('click', function() {
        setCarouselSlide(activeCarouselIndex + 1);
      });
    }

    carouselDots.forEach(function(dot, dotIndex) {
      dot.addEventListener('click', function() {
        setCarouselSlide(dotIndex);
      });
    });

    setCarouselSlide(0);
  }

  if (tokenComparison) {
    var tokenComparisonVideos = Array.prototype.slice.call(tokenComparison.querySelectorAll('[data-token-video]'));
    var tokenComparisonDoneLabels = Array.prototype.slice.call(tokenComparison.querySelectorAll('[data-token-done]'));
    var tokenComparisonDots = Array.prototype.slice.call(tokenComparison.querySelectorAll('[data-token-comparison-dot]'));
    var tokenComparisonPrev = tokenComparison.querySelector('[data-token-comparison-prev]');
    var tokenComparisonNext = tokenComparison.querySelector('[data-token-comparison-next]');
    var tokenComparisonCount = tokenComparison.querySelector('[data-token-comparison-count]');
    var tokenComparisonIndex = 0;
    var tokenComparisonTotal = 10;
    var tokenComparisonSyncTimer = null;
    var goalDoneTimes = {
      576: [2.8, 2.2, 1.3, 1.9, 1.5, 1.4, 1.8, 1.8, 1.7, 1.3],
      192: [2.5, 2.1, 0.9, 1.4, 1.1, 0.9, 1.4, 1.4, 1.4, 0.9]
    };

    function tokenExamplePath(tokenValue, exampleIndex) {
      var exampleNumber = String(exampleIndex + 1).padStart(2, '0');
      return './video/goal/' + tokenValue + '/example-' + exampleNumber + '.mp4';
    }

    function doneLabelForToken(tokenValue) {
      return tokenComparison.querySelector('[data-token-done="' + tokenValue + '"]');
    }

    function hideComparisonDoneLabels() {
      tokenComparisonDoneLabels.forEach(function(label) {
        label.classList.remove('is-visible');
        label.textContent = '';
      });
    }

    function showComparisonDoneLabel(tokenValue) {
      var label = doneLabelForToken(tokenValue);
      var tokenTimes = goalDoneTimes[tokenValue];
      var doneTime = tokenTimes ? tokenTimes[tokenComparisonIndex] : null;

      if (!label || doneTime === null || doneTime === undefined) {
        return;
      }

      label.textContent = '';
      label.appendChild(document.createTextNode('(Done in '));
      var time = document.createElement('span');
      time.className = 'done-time';
      time.textContent = doneTime.toFixed(1);
      label.appendChild(time);
      var unit = document.createElement('span');
      unit.className = 'done-unit';
      unit.textContent = 's';
      label.appendChild(unit);
      label.appendChild(document.createTextNode(')'));
      label.classList.add('is-visible');
    }

    function prepareComparisonVideo(video, exampleIndex) {
      var tokenValue = video.getAttribute('data-token-video');
      var nextSrc = tokenExamplePath(tokenValue, exampleIndex);

      video.muted = true;
      video.loop = false;
      video.playsInline = true;
      video.removeAttribute('loop');
      video.setAttribute('playsinline', '');

      if (video.getAttribute('src') !== nextSrc) {
        video.setAttribute('src', nextSrc);
        video.load();
      } else {
        seekVideoToStart(video);
      }
    }

    function restartComparisonVideos() {
      hideComparisonDoneLabels();

      tokenComparisonVideos.forEach(function(video) {
        video.pause();
        video.loop = false;
        video.removeAttribute('loop');
        seekVideoToStart(video);
      });

      window.requestAnimationFrame(function() {
        tokenComparisonVideos.forEach(function(video) {
          playInlineVideo(video);
        });
      });
    }

    function startComparisonSyncTimer() {
      if (tokenComparisonSyncTimer || tokenComparisonVideos.length < 2) {
        return;
      }

      tokenComparisonSyncTimer = window.setInterval(function() {
        var leader = tokenComparisonVideos[0];

        if (!leader || leader.paused || !Number.isFinite(leader.currentTime)) {
          return;
        }

        tokenComparisonVideos.slice(1).forEach(function(video) {
          if (video.paused || video.readyState < 2 || !Number.isFinite(video.currentTime)) {
            return;
          }

          var targetTime = leader.currentTime;

          if (Number.isFinite(video.duration) && video.duration > 0) {
            targetTime = Math.min(targetTime, Math.max(0, video.duration - 0.08));
          }

          if (Math.abs(video.currentTime - targetTime) > 0.18) {
            try {
              video.currentTime = targetTime;
            } catch (error) {}
          }
        });
      }, 900);
    }

    function setTokenComparisonExample(index) {
      tokenComparisonIndex = (index + tokenComparisonTotal) % tokenComparisonTotal;
      hideComparisonDoneLabels();

      tokenComparisonVideos.forEach(function(video) {
        video.pause();
        prepareComparisonVideo(video, tokenComparisonIndex);
      });

      updateDotSelection(tokenComparisonDots, tokenComparisonIndex);

      if (tokenComparisonCount) {
        tokenComparisonCount.textContent = (tokenComparisonIndex + 1) + ' / ' + tokenComparisonTotal;
      }

      Promise.all(tokenComparisonVideos.map(waitForVideoFrame)).then(function() {
        restartComparisonVideos();
        startComparisonSyncTimer();
      });
    }

    tokenComparisonVideos.forEach(function(video) {
      video.addEventListener('ended', function() {
        showComparisonDoneLabel(video.getAttribute('data-token-video'));
      });
    });

    if (tokenComparisonPrev) {
      tokenComparisonPrev.addEventListener('click', function() {
        setTokenComparisonExample(tokenComparisonIndex - 1);
      });
    }

    if (tokenComparisonNext) {
      tokenComparisonNext.addEventListener('click', function() {
        setTokenComparisonExample(tokenComparisonIndex + 1);
      });
    }

    tokenComparisonDots.forEach(function(dot, dotIndex) {
      dot.addEventListener('click', function() {
        setTokenComparisonExample(dotIndex);
      });
    });

    setTokenComparisonExample(0);
  }

  if (!('IntersectionObserver' in window)) {
    revealItems.forEach(function(item) {
      item.classList.add('is-visible');
    });
    return;
  }

  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12
  });

  revealItems.forEach(function(item) {
    observer.observe(item);
  });
});
