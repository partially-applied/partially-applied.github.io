require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"./dist/main.js":[function(require,module,exports){
var most, getFile, showPage;
most = require('./external.js').most;
getFile = require('./utils').getFile;
showPage = require('./showPage');
getFile({
  url: 'data.csv'
}).chain(function(arg$){
  var code, responseText;
  code = arg$[0], responseText = arg$[1];
  if (code === 404) {
    return most.empty();
  } else {
    return most.just(responseText);
  }
}).map(showPage).drain();
},{"./external.js":undefined,"./showPage":3,"./utils":4}],1:[function(require,module,exports){
var create;
create = function(){
  var styles;
  styles = {};
  styles.dropdownOuter = {
    borderStyle: 'solid',
    borderWidth: '0px',
    marginTop: '0.3em',
    width: '99.8%',
    height: '4em',
    fontSize: '1.5em',
    zIndex: 10
  };
  styles.tableOuter = {
    borderStyle: 'solid',
    borderWidth: '0px',
    width: '99.8%',
    height: '600px',
    overflowY: 'scroll',
    display: "none"
  };
  styles.chart = {
    borderStyle: 'solid',
    borderWidth: '0px',
    width: '100%',
    height: '600px',
    display: 'inline'
  };
  return styles;
};
module.exports = create;
},{}],2:[function(require,module,exports){
var ref$, _, h, patch, nv, d3, colors, table, dropdown, vjs, events$, wait, dropdownModel, dropdownParams, init, getStream, parse, cleanDate, prepareDataForChart, timeFormat, createChart, prepareDataForTable, update, legacyUpdate, createEvents, main;
ref$ = require('./external.js'), _ = ref$._, h = ref$.h, patch = ref$.patch, nv = ref$.nv, d3 = ref$.d3, colors = ref$.colors, table = ref$.table, dropdown = ref$.dropdown, vjs = ref$.vjs;
ref$ = require('./utils'), events$ = ref$.events$, wait = ref$.wait;
dropdownModel = {
  options: ["table", "chart"],
  value: 1,
  onchange: []
};
dropdownParams = {
  scroll: {
    maxHeight: "95px",
    style: {
      margin: "0.00em",
      padding: "0.00em"
    }
  },
  valuebox: {
    style: {
      zIndex: 3,
      paddingBottom: "0.00em",
      paddingTop: "0.00em",
      margin: "0.00em"
    }
  }
};
init = require('./constants');
getStream = require('./utils').getStream;
parse = function(response){
  var lines, res$, i$, ref$, len$, I, data, heading, line, j$, to$, K;
  res$ = [];
  for (i$ = 0, len$ = (ref$ = response.split('\n')).length; i$ < len$; ++i$) {
    I = ref$[i$];
    res$.push(I.split(','));
  }
  lines = res$;
  data = _.tail(lines);
  heading = _.head(lines);
  for (i$ = 0, len$ = data.length; i$ < len$; ++i$) {
    line = data[i$];
    for (j$ = 1, to$ = line.length; j$ < to$; ++j$) {
      K = j$;
      line[K] = parseFloat(line[K]);
    }
  }
  return [heading, data];
};
cleanDate = function(data){
  var vals;
  vals = data.split('/');
  return {
    date: parseInt(vals[0]),
    month: parseInt(vals[1]),
    year: parseInt(vals[2])
  };
};
prepareDataForChart = function(headings, data){
  var output, colorkeys, names, i$, to$, I, entry, values, j$, len$, K, timeFormatted, points;
  output = [];
  colorkeys = Object.keys(colors).slice(0, -2);
  names = _.tail(headings);
  for (i$ = 0, to$ = names.length; i$ < to$; ++i$) {
    I = i$;
    entry = {};
    entry.colors = colors[colorkeys[I]][5];
    entry.key = names[I];
    values = [];
    for (j$ = 0, len$ = data.length; j$ < len$; ++j$) {
      K = data[j$];
      timeFormatted = cleanDate(K[0]);
      points = {
        x: new Date(timeFormatted.year, timeFormatted.month, timeFormatted.date),
        y: K[I + 1]
      };
      values.push(points);
    }
    entry.values = values;
    output.push(entry);
  }
  return output;
};
timeFormat = function(d){
  return d3.time.format('%d-%m-%y')(new Date(d));
};
createChart = function(prepareData, element){
  return nv.addGraph(function(){
    var chart;
    chart = nv.models.lineWithFocusChart();
    chart.xAxis.tickFormat(timeFormat);
    chart.x2Axis.tickFormat(timeFormat);
    chart.xScale(d3.time.scale());
    chart.yAxis.tickFormat(d3.format(',.2f'));
    chart.y2Axis.tickFormat(d3.format(',.2f'));
    d3.select(element).datum(prepareData).transition().duration(100).call(chart);
    return nv.utils.windowResize(chart.update);
  });
};
prepareDataForTable = function(heading, data){
  var I;
  return {
    heading: heading,
    rows: (function(){
      var i$, ref$, len$, results$ = [];
      for (i$ = 0, len$ = (ref$ = data).length; i$ < len$; ++i$) {
        I = ref$[i$];
        results$.push({
          value: I
        });
      }
      return results$;
    }())
  };
};
update = _.curry(function(Ctrl, eventType, data){
  var events, nodes, tableOuter, chart;
  events = Ctrl.events, nodes = Ctrl.nodes;
  tableOuter = nodes.tableOuter, chart = nodes.chart;
  switch (eventType) {
  case events.dropdownClick:
    switch (data.options[data.value]) {
    case 'chart':
      return function(Then){
        return vjs(tableOuter.elm, {
          opacity: 0,
          scale: 0.9,
          oncomplete: Then
        }, {
          duration: 500
        });
      }(function(){
        return function(Then){
          return vjs(tableOuter.elm, {
            oncomplete: Then
          }, {
            duration: 0
          });
        }(function(){
          tableOuter.elm.style.display = 'none';
          return function(Then){
            return vjs(chart.elm, {
              scale: 0.9,
              opacity: 0,
              oncomplete: Then
            }, {
              duration: 0
            });
          }(function(){
            return wait(100, function(){
              chart.elm.style.display = 'block';
              return vjs(chart.elm, {
                opacity: 1,
                scale: 1
              }, {
                duration: 500
              });
            });
          });
        });
      });
    case 'table':
      return function(Then){
        return vjs(chart.elm, {
          opacity: 0,
          scale: 0.9,
          oncomplete: Then
        }, {
          duration: 500
        });
      }(function(){
        return function(Then){
          return vjs(chart.elm, {
            oncomplete: Then
          }, {
            duration: 0
          });
        }(function(){
          chart.elm.style.display = 'none';
          return function(Then){
            return vjs(tableOuter.elm, {
              scale: 0.9,
              opacity: 0,
              oncomplete: Then
            }, {
              duration: 0
            });
          }(function(){
            return wait(100, function(){
              var table;
              tableOuter.elm.style.display = 'block';
              table = Ctrl.components.table;
              table.update(table.events.resize, undefined);
              return vjs(tableOuter.elm, {
                opacity: 1,
                scale: 1
              }, {
                duration: 500
              });
            });
          });
        });
      });
    }
  }
});
legacyUpdate = function(Ctrl){
  return function(arg$, data){
    var eventName;
    eventName = arg$.eventName;
    return Ctrl.signal(eventName, data);
  };
};
createEvents = function(){
  return {
    dropdownClick: Symbol('dropdownClick')
  };
};
main = function(response){
  var Ctrl, ref$, heading, data, preparedData, styles, nodes, events, signal, tableInstance, chartInsertStream, outputVnode;
  Ctrl = {};
  Ctrl.components = {};
  ref$ = parse(response), heading = ref$[0], data = ref$[1];
  preparedData = prepareDataForChart(heading, data);
  styles = init();
  nodes = {};
  events = createEvents();
  Ctrl.events = events;
  Ctrl.nodes = nodes;
  signal = update(Ctrl);
  Ctrl.signal = signal;
  nodes.dropdown = dropdown(dropdownModel, dropdownParams);
  dropdownModel.onchange.push(events$(legacyUpdate(Ctrl))({
    eventName: events.dropdownClick
  }));
  nodes.dropdownOuter = h('div', {
    style: styles.dropdownOuter
  }, [nodes.dropdown]);
  nodes.chart = h('svg', {
    style: styles.chart
  });
  tableInstance = table(prepareDataForTable(heading, data, function(){}));
  Ctrl.components.table = tableInstance;
  nodes.tableOuter = h('div', {
    style: styles.tableOuter
  }, [tableInstance.node]);
  chartInsertStream = getStream(['hook', 'insert'], nodes.chart);
  chartInsertStream.map(function(vnode){
    return createChart(preparedData, vnode.elm);
  }).drain();
  outputVnode = [nodes.dropdownOuter, nodes.tableOuter, nodes.chart];
  return h('div', outputVnode);
};
module.exports = main;
},{"./constants":1,"./external.js":undefined,"./utils":4}],3:[function(require,module,exports){
var ref$, _, h, patch, nv, d3, colors, moment, createCssHead, createPage, cssFiles, styleMain, main;
ref$ = require('./external.js'), _ = ref$._, h = ref$.h, patch = ref$.patch, nv = ref$.nv, d3 = ref$.d3, colors = ref$.colors, moment = ref$.moment;
createCssHead = require('./utils').createCssHead;
createPage = require('./createPage');
cssFiles = ['normalize.css', 'css.css', 'scrollbar.css', './vendors/nv.d3.css'];
styleMain = {
  borderStyle: 'solid',
  borderWidth: '0px',
  width: '99.8%',
  height: '100%',
  overflowY: 'hidden'
};
main = function(response){
  var ref$, head, onload;
  ref$ = createCssHead(cssFiles), head = ref$[0], onload = ref$[1];
  onload.map(function(){
    var outputVnode;
    outputVnode = h('body', {
      style: styleMain
    }, [createPage(response)]);
    return patch(document.getElementById('app'), outputVnode);
  }).drain();
  return patch(document.head, head);
};
module.exports = main;
},{"./createPage":2,"./external.js":undefined,"./utils":4}],4:[function(require,module,exports){
var ref$, nanoAjax, most, _, h, lo, getFile, createCssHead, getStream, Normalize, events$;
ref$ = require('./external.js'), nanoAjax = ref$.nanoAjax, most = ref$.most, _ = ref$._, h = ref$.h, lo = ref$.lo;
getFile = _.curry(function(input, add, end, error){
  return nanoAjax.ajax(input, function(code, responeText){
    add([code, responeText]);
    return end();
  });
});
createCssHead = function(styleSheets){
  var links, hooks, i$, len$, I, elm, hook, outputNode, postpatchStream, onloadStream;
  links = [];
  hooks = [];
  for (i$ = 0, len$ = styleSheets.length; i$ < len$; ++i$) {
    I = styleSheets[i$];
    elm = h('link', {
      attrs: {
        rel: "stylesheet",
        type: 'text/css',
        href: I
      }
    });
    hook = {};
    elm.data.hook = hook;
    hooks.push(hook);
    links.push(elm);
  }
  outputNode = h('head', links);
  postpatchStream = most.create(function(add){
    outputNode.data.hook = {
      postpatch: function(oldVNode, vnode){
        return add(vnode);
      }
    };
  });
  onloadStream = postpatchStream.chain(function(node){
    var onloadStream;
    return onloadStream = most.create(function(add){
      var i$, ref$, len$, I, results$ = [];
      for (i$ = 0, len$ = (ref$ = node.children).length; i$ < len$; ++i$) {
        I = ref$[i$];
        results$.push(I.elm.onload = add);
      }
      return results$;
    }).skip(styleSheets.length - 1);
  });
  return [outputNode, onloadStream];
};
getStream = function(arg$, vnode){
  var streamType1, streamType2, entry;
  streamType1 = arg$[0], streamType2 = arg$[1];
  if (vnode.data[streamType1] === undefined) {
    vnode.data[streamType1] = {};
    entry = vnode.data[streamType1];
  }
  return most.create(function(add){
    entry[streamType2] = add;
  });
};
Normalize = function(EventName){
  var TypeOfEvent, Output, i$, len$, I, Child;
  TypeOfEvent = typeof EventName;
  switch (TypeOfEvent) {
  case "string":
    Output = [{
      eventName: EventName,
      children: []
    }];
    break;
  case "object":
    if (Array.isArray(EventName)) {
      Output = [];
      for (i$ = 0, len$ = EventName.length; i$ < len$; ++i$) {
        I = EventName[i$];
        Output.push(Normalize(I));
      }
    } else {
      if (EventName.children === undefined) {
        EventName.children = [];
      } else {
        Child = Normalize(EventName.children);
        EventName.children = Child;
      }
      Output = [EventName];
    }
  }
  return lo.flatten(Output);
};
events$ = function(update){
  return function(EventName){
    var NormalizedEventName;
    NormalizedEventName = Normalize(EventName);
    return function(EventOb){
      var i$, ref$, len$, I;
      for (i$ = 0, len$ = (ref$ = NormalizedEventName).length; i$ < len$; ++i$) {
        I = ref$[i$];
        update(I, arguments[0]);
      }
    };
  };
};
module.exports = {
  getFile: function(input){
    return most.create(getFile(input));
  },
  createCssHead: createCssHead,
  wait: function(time, f){
    return setTimeout(f, time);
  },
  getStream: getStream,
  events$: events$
};
},{"./external.js":undefined}]},{},["./dist/main.js"]);
