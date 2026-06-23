document.addEventListener('DOMContentLoaded', function() {
  var root = document.getElementById('evaluation-table-root');

  if (!root) {
    return;
  }

  var columns = [
    { key: 'method', label: 'Method' },
    { key: 'refcocoVal', label: 'val', group: 'RefCOCO' },
    { key: 'refcocoTestA', label: 'testA', group: 'RefCOCO' },
    { key: 'refcocoTestB', label: 'testB', group: 'RefCOCO' },
    { key: 'refcocopVal', label: 'val', group: 'RefCOCO+' },
    { key: 'refcocopTestA', label: 'testA', group: 'RefCOCO+' },
    { key: 'refcocopTestB', label: 'testB', group: 'RefCOCO+' },
    { key: 'refcocogVal', label: 'val', group: 'RefCOCOg' },
    { key: 'refcocogTest', label: 'test', group: 'RefCOCOg' },
    { key: 'avg', label: 'Avg.' },
    { key: 'rel', label: 'Rel.' }
  ];

  var sections = [
    {
      label: 'Upper Bound, All 576 Tokens',
      note: '100%',
      rows: [
        {
          method: 'GLaMM',
          venue: 'CVPR24',
          scores: ['79.5', '83.2', '76.9', '72.6', '78.7', '64.6', '74.2', '74.9'],
          ratios: ['100%', '100%', '100%', '100%', '100%', '100%', '100%', '100%'],
          avg: '75.5',
          rel: '100%'
        }
      ]
    },
    {
      label: 'Retain 192 Tokens',
      note: '↓ 66.7%',
      rows: [
        {
          method: 'TRIM',
          venue: 'COLING25',
          scores: ['55.5', '58.5', '54.5', '40.6', '43.2', '36.5', '45.2', '45.1'],
          ratios: ['69.8%', '70.3%', '70.8%', '55.9%', '54.8%', '56.5%', '60.9%', '60.2%'],
          avg: '47.3',
          rel: '62.6%'
        },
        {
          method: 'FastV',
          venue: 'ECCV24',
          scores: ['69.5', '73.9', '63.6', '57.9', '64.2', '48.3', '61.5', '62.0'],
          ratios: ['87.4%', '88.8%', '82.7%', '79.7%', '81.5%', '74.7%', '82.8%', '82.7%'],
          avg: '62.6',
          rel: '82.9%'
        },
        {
          method: 'LLaVA-PruMerge',
          venue: 'ICCV25',
          scores: ['68.8', '74.6', '64.1', '58.2', '66.2', '50.0', '61.2', '62.1'],
          ratios: ['86.5%', '89.6%', '83.3%', '80.1%', '84.1%', '77.3%', '82.4%', '82.9%'],
          avg: '63.1',
          rel: '83.5%'
        },
        {
          method: 'VisionZip',
          venue: 'CVPR25',
          scores: ['71.1', '76.4', '66.6', '59.7', '67.2', '54.0', '64.7', '64.3'],
          ratios: ['89.4%', '91.8%', '86.6%', '82.2%', '85.3%', '83.5%', '87.1%', '85.8%'],
          avg: '65.5',
          rel: '86.7%'
        },
        {
          method: 'VisPruner',
          venue: 'ICCV25',
          scores: ['72.4', '75.5', '66.8', '61.5', '66.9', '54.2', '65.4', '65.2'],
          ratios: ['91.0%', '90.7%', '86.8%', '84.7%', '85.0%', '83.9%', '88.1%', '87.0%'],
          avg: '66.0',
          rel: '87.4%'
        },
        {
          method: 'LiteLVLM',
          venue: 'ICML26',
          isBest: true,
          scores: ['74.4', '78.7', '67.0', '64.1', '72.2', '55.2', '66.0', '67.8'],
          ratios: ['93.6%', '94.6%', '87.1%', '88.8%', '91.7%', '85.4%', '88.9%', '90.5%'],
          avg: '68.1',
          rel: '90.3%'
        }
      ]
    },
    {
      label: 'Retain 128 Tokens',
      note: '↓ 77.8%',
      rows: [
        {
          method: 'TRIM',
          venue: 'COLING25',
          scores: ['53.1', '54.4', '50.0', '37.1', '39.9', '35.4', '42.8', '42.8'],
          ratios: ['66.7%', '65.3%', '65.0%', '51.1%', '50.6%', '54.7%', '57.6%', '57.1%'],
          avg: '44.4',
          rel: '58.8%'
        },
        {
          method: 'FastV',
          venue: 'ECCV24',
          scores: ['64.9', '69.9', '58.4', '51.9', '59.3', '43.2', '56.6', '56.8'],
          ratios: ['81.6%', '84.0%', '75.9%', '71.4%', '75.3%', '66.8%', '76.2%', '75.8%'],
          avg: '57.6',
          rel: '76.3%'
        },
        {
          method: 'LLaVA-PruMerge',
          venue: 'ICCV25',
          scores: ['64.2', '70.9', '60.3', '54.1', '61.0', '47.1', '57.6', '58.8'],
          ratios: ['80.7%', '85.2%', '78.4%', '74.5%', '77.5%', '72.9%', '77.6%', '78.5%'],
          avg: '59.2',
          rel: '78.4%'
        },
        {
          method: 'VisionZip',
          venue: 'CVPR25',
          scores: ['66.4', '71.1', '60.9', '54.5', '62.2', '47.9', '59.6', '59.0'],
          ratios: ['83.5%', '85.4%', '79.1%', '75.0%', '79.0%', '74.1%', '80.3%', '78.7%'],
          avg: '60.2',
          rel: '79.7%'
        },
        {
          method: 'VisPruner',
          venue: 'ICCV25',
          scores: ['66.7', '72.5', '64.0', '55.8', '62.2', '48.6', '59.6', '59.8'],
          ratios: ['83.8%', '87.1%', '83.2%', '76.8%', '79.0%', '75.2%', '80.3%', '79.8%'],
          avg: '61.1',
          rel: '80.9%'
        },
        {
          method: 'LiteLVLM',
          venue: 'ICML26',
          isBest: true,
          scores: ['72.1', '77.5', '64.5', '61.7', '69.0', '52.0', '63.3', '63.7'],
          ratios: ['90.7%', '93.1%', '83.9%', '85.0%', '87.7%', '80.5%', '85.3%', '85.0%'],
          avg: '65.5',
          rel: '86.8%'
        }
      ]
    },
    {
      label: 'Retain 64 Tokens',
      note: '↓ 88.9%',
      rows: [
        {
          method: 'TRIM',
          venue: 'COLING25',
          scores: ['50.1', '52.6', '49.2', '33.1', '35.4', '30.9', '38.7', '39.4'],
          ratios: ['63.0%', '63.2%', '63.9%', '45.5%', '44.9%', '47.8%', '52.1%', '52.6%'],
          avg: '41.1',
          rel: '54.1%'
        },
        {
          method: 'FastV',
          venue: 'ECCV24',
          scores: ['57.3', '60.8', '52.4', '42.1', '45.1', '37.6', '47.9', '48.6'],
          ratios: ['72.0%', '73.0%', '68.1%', '57.9%', '57.3%', '58.2%', '64.5%', '64.8%'],
          avg: '48.9',
          rel: '64.8%'
        },
        {
          method: 'LLaVA-PruMerge',
          venue: 'ICCV25',
          scores: ['58.9', '64.3', '54.9', '45.9', '50.3', '42.4', '49.5', '50.0'],
          ratios: ['74.0%', '77.2%', '71.3%', '63.2%', '63.9%', '65.6%', '66.7%', '66.7%'],
          avg: '52.0',
          rel: '68.8%'
        },
        {
          method: 'VisionZip',
          venue: 'CVPR25',
          scores: ['59.0', '63.8', '55.1', '47.1', '51.9', '40.1', '49.2', '51.7'],
          ratios: ['74.2%', '76.6%', '71.6%', '64.8%', '65.9%', '62.0%', '66.3%', '69.0%'],
          avg: '52.2',
          rel: '69.1%'
        },
        {
          method: 'VisPruner',
          venue: 'ICCV25',
          scores: ['57.8', '62.7', '54.3', '45.7', '49.3', '40.5', '49.8', '52.3'],
          ratios: ['72.7%', '75.3%', '70.6%', '62.9%', '62.6%', '62.6%', '67.1%', '69.8%'],
          avg: '51.5',
          rel: '68.2%'
        },
        {
          method: 'LiteLVLM',
          venue: 'ICML26',
          isBest: true,
          scores: ['66.3', '74.5', '58.2', '56.2', '64.0', '46.7', '56.1', '56.5'],
          ratios: ['83.4%', '89.5%', '75.7%', '77.4%', '81.3%', '72.3%', '75.6%', '75.4%'],
          avg: '59.8',
          rel: '79.2%'
        }
      ]
    }
  ];

  var videoTables = [
    {
      title: 'Ref-DAVIS-17.',
      metric: 'Metric: J / F / J&F',
      rows: [
        {
          type: 'section',
          label: 'Upper Bound, All 576 Tokens',
          note: '100%'
        },
        {
          model: 'VideoGLaMM',
          values: ['65.6', '73.3', '69.5', '100%']
        },
        {
          type: 'section',
          label: 'Retain 196 Tokens',
          note: '↓ 65.9%'
        },
        {
          model: 'VisPruner',
          values: ['61.2', '67.4', '64.3', '92.5%']
        },
        {
          model: 'LiteLVLM',
          values: ['66.8', '71.6', '69.2', '99.5%'],
          isBest: true
        },
        {
          type: 'section',
          label: 'Retain 81 Tokens',
          note: '↓ 85.9%'
        },
        {
          model: 'VisPruner',
          values: ['57.1', '63.5', '60.3', '86.7%']
        },
        {
          model: 'LiteLVLM',
          values: ['64.3', '67.8', '66.1', '95.1%'],
          isBest: true
        }
      ]
    },
    {
      title: 'Refer-YouTube-VOS.',
      metric: 'Metric: J / F / J&F',
      rows: [
        {
          type: 'section',
          label: 'Upper Bound, All 576 Tokens',
          note: '100%'
        },
        {
          model: 'VideoGLaMM',
          values: ['65.4', '68.2', '66.8', '100%']
        },
        {
          type: 'section',
          label: 'Retain 196 Tokens',
          note: '↓ 65.9%'
        },
        {
          model: 'VisPruner',
          values: ['60.6', '63.9', '62.3', '93.2%']
        },
        {
          model: 'LiteLVLM',
          values: ['65.1', '67.9', '66.5', '99.5%'],
          isBest: true
        },
        {
          type: 'section',
          label: 'Retain 81 Tokens',
          note: '↓ 85.9%'
        },
        {
          model: 'VisPruner',
          values: ['58.1', '62.2', '60.1', '89.9%']
        },
        {
          model: 'LiteLVLM',
          values: ['60.8', '67.6', '64.2', '96.1%'],
          isBest: true
        }
      ]
    }
  ];

  function cell(tag, className, text) {
    var element = document.createElement(tag);
    if (className) {
      element.className = className;
    }
    if (text !== undefined) {
      element.textContent = text;
    }
    return element;
  }

  function renderMethodCell(row) {
    var method = cell('td', 'method-cell');

    var name = document.createElement('span');
    name.className = row.isBest ? 'model-name best-model' : 'model-name';
    name.textContent = row.method;
    method.appendChild(name);

    var venue = document.createElement('span');
    venue.className = 'venue-tag';
    venue.textContent = row.venue;
    method.appendChild(venue);

    return method;
  }

  function renderValueCell(value, highlight, isBest) {
    var className = highlight ? 'metric-cell overall-cell' : 'metric-cell';
    if (isBest) {
      className += ' best-score';
    }
    return cell('td', className, value);
  }

  function renderTable() {
    var section = document.createElement('div');
    section.className = 'evaluation-module';

    var pill = cell('div', 'evaluation-pill', 'EVALUATION');
    section.appendChild(pill);

    var title = cell('h2', 'title evaluation-title');
    title.appendChild(cell('span', 'evaluation-title-accent', 'How'));
    title.appendChild(document.createTextNode(' Does LiteLVLM Perform?'));
    section.appendChild(title);

    var description = cell(
      'p',
      'evaluation-description',
      'Performance comparison of LiteLVLM on Referring Expression Segmentation.'
    );
    section.appendChild(description);

    var metricPills = document.createElement('div');
    metricPills.className = 'metric-pills';
    metricPills.appendChild(cell('span', 'metric-pill', 'Model: GLaMM'));
    metricPills.appendChild(cell('span', 'metric-pill', 'Metric: cIoU (%)'));
    metricPills.appendChild(cell('span', 'metric-pill', 'Upper bound: 576 visual tokens'));
    section.appendChild(metricPills);

    var tableWrap = document.createElement('div');
    tableWrap.className = 'evaluation-table-wrap';

    var table = document.createElement('table');
    table.className = 'evaluation-table';

    var thead = document.createElement('thead');
    var groupRow = document.createElement('tr');
    var methodHead = cell('th', 'sticky-method', 'Method');
    methodHead.rowSpan = 2;
    groupRow.appendChild(methodHead);

    [
      ['RefCOCO', 3],
      ['RefCOCO+', 3],
      ['RefCOCOg', 2]
    ].forEach(function(group) {
      var th = cell('th', 'group-head', group[0]);
      th.colSpan = group[1];
      groupRow.appendChild(th);
    });

    var overallHead = cell('th', 'overall-head', 'Overall');
    overallHead.colSpan = 2;
    groupRow.appendChild(overallHead);
    thead.appendChild(groupRow);

    var subsetRow = document.createElement('tr');
    columns.slice(1, 9).forEach(function(column) {
      subsetRow.appendChild(cell('th', 'subset-head', column.label));
    });
    subsetRow.appendChild(cell('th', 'subset-head overall-head', 'Avg.'));
    subsetRow.appendChild(cell('th', 'subset-head overall-head', 'Rel.'));
    thead.appendChild(subsetRow);
    table.appendChild(thead);

    var tbody = document.createElement('tbody');
    sections.forEach(function(sectionData) {
      var group = document.createElement('tr');
      group.className = 'evaluation-section-row';
      var groupCell = cell('td', '', sectionData.label + ' ');
      groupCell.colSpan = columns.length;
      var note = cell('span', 'reduction-note', sectionData.note);
      groupCell.appendChild(note);
      group.appendChild(groupCell);
      tbody.appendChild(group);

      sectionData.rows.forEach(function(row) {
        var scoreRow = document.createElement('tr');
        if (row.isBest) {
          scoreRow.className = 'best-row';
        }
        scoreRow.appendChild(renderMethodCell(row));
        row.scores.forEach(function(value) {
          scoreRow.appendChild(renderValueCell(value, false, row.isBest));
        });
        scoreRow.appendChild(renderValueCell(row.avg, true, row.isBest));
        scoreRow.appendChild(renderValueCell(row.rel, true, row.isBest));
        tbody.appendChild(scoreRow);
      });
    });

    table.appendChild(tbody);
    tableWrap.appendChild(table);
    section.appendChild(tableWrap);

    root.appendChild(section);
  }

  function renderVideoTable(tableData) {
    var section = document.createElement('div');
    section.className = 'evaluation-module evaluation-module-secondary';

    var title = cell('h3', 'title evaluation-subtitle', tableData.title);
    section.appendChild(title);

    var metricPills = document.createElement('div');
    metricPills.className = 'metric-pills';
    metricPills.appendChild(cell('span', 'metric-pill', 'Model: VideoGLaMM'));
    metricPills.appendChild(cell('span', 'metric-pill', tableData.metric));
    metricPills.appendChild(cell('span', 'metric-pill', 'Upper bound: 576 visual tokens'));
    section.appendChild(metricPills);

    var tableWrap = document.createElement('div');
    tableWrap.className = 'evaluation-table-wrap';

    var table = document.createElement('table');
    table.className = 'evaluation-table evaluation-table-compact';

    var thead = document.createElement('thead');
    var headerRow = document.createElement('tr');
    ['Model', 'J', 'F', 'J&F', 'Rel.'].forEach(function(label, index) {
      headerRow.appendChild(cell('th', index === 0 ? 'sticky-method' : 'metric-head', label));
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    var tbody = document.createElement('tbody');
    tableData.rows.forEach(function(row) {
      var tr = document.createElement('tr');

      if (row.type === 'section') {
        tr.className = 'evaluation-section-row';
        var sectionCell = cell('td', '', row.label + ' ');
        sectionCell.colSpan = 5;
        sectionCell.appendChild(cell('span', 'reduction-note', row.note));
        tr.appendChild(sectionCell);
        tbody.appendChild(tr);
        return;
      }

      if (row.isBest) {
        tr.className = 'best-row';
      }

      var method = cell('td', 'method-cell');
      var name = cell('span', row.isBest ? 'model-name best-model' : 'model-name', row.model);
      method.appendChild(name);
      tr.appendChild(method);

      row.values.forEach(function(value, index) {
        tr.appendChild(renderValueCell(value, index === row.values.length - 1, row.isBest));
      });
      tbody.appendChild(tr);
    });

    table.appendChild(tbody);
    tableWrap.appendChild(table);
    section.appendChild(tableWrap);
    return section;
  }

  renderTable();

  var videoGrid = document.createElement('div');
  videoGrid.className = 'evaluation-video-grid';
  videoTables.forEach(function(tableData) {
    videoGrid.appendChild(renderVideoTable(tableData));
  });
  root.appendChild(videoGrid);
});
