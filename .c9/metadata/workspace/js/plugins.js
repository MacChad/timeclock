{"filter":false,"title":"plugins.js","tooltip":"/js/plugins.js","undoManager":{"mark":0,"position":0,"stack":[[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":0,"column":0},"end":{"row":0,"column":8}},"text":"// Todo:"},{"action":"insertText","range":{"start":{"row":0,"column":8},"end":{"row":1,"column":0}},"text":"\r\n"},{"action":"insertLines","range":{"start":{"row":1,"column":0},"end":{"row":90,"column":0}},"lines":["// 1) Make the button prettier","// 2) add a config option for IE users which takes a URL.  That URL should accept a POST request with a","//    JSON encoded object in the payload and return a CSV.  This is necessary because IE doesn't let you","//    download from a data-uri link","//","// Notes:  This has not been adequately tested and is very much a proof of concept at this point","function ngGridCsvExportPlugin (opts) {","    var self = this;","    self.grid = null;","    self.scope = null;","    self.services = null;","","    self.init = function(scope, grid, services) {","        self.grid = grid;","        self.scope = scope;","        self.services = services;","","        function showDs() {","            var keys = [];","            for (var f in grid.config.columnDefs) { ","                if (grid.config.columnDefs.hasOwnProperty(f))","                {   ","                    keys.push(grid.config.columnDefs[f].field);","                }   ","            }   ","            var csvData = '';","            function csvStringify(str) {","                if (str == null) { // we want to catch anything null-ish, hence just == not ===","                    return '';","                }","                if (typeof(str) === 'number') {","                    return '' + str;","                }","                if (typeof(str) === 'boolean') {","                    return (str ? 'TRUE' : 'FALSE') ;","                }","                if (typeof(str) === 'string') {","                    return str.replace(/\"/g,'\"\"');","                }","","                return JSON.stringify(str).replace(/\"/g,'\"\"');","            }","            function swapLastCommaForNewline(str) {","                var newStr = str.substr(0,str.length - 1);","                return newStr + \"\\n\";","            }","            for (var k in keys) {","                csvData += '\"' + csvStringify(keys[k]) + '\",';","            }","            csvData = swapLastCommaForNewline(csvData);","            var gridData = grid.data;","            for (var gridRow in gridData) {","                for ( k in keys) {","                    var curCellRaw;","","                    if (opts != null && opts.columnOverrides != null && opts.columnOverrides[keys[k]] != null) {","                        curCellRaw = opts.columnOverrides[keys[k]](","                            self.services.UtilityService.evalProperty(gridData[gridRow], keys[k]));","                    } else {","                        curCellRaw = self.services.UtilityService.evalProperty(gridData[gridRow], keys[k]);","                    }","","                    csvData += '\"' + csvStringify(curCellRaw) + '\",';","                }","                csvData = swapLastCommaForNewline(csvData);","            }","            var fp = grid.$root.find(\".ngFooterPanel\");","            var csvDataLinkPrevious = grid.$root.find('.ngFooterPanel .csv-data-link-span');","            if (csvDataLinkPrevious != null) {csvDataLinkPrevious.remove() ; }","            var csvDataLinkHtml = \"<span class=\\\"csv-data-link-span\\\">\";","            csvDataLinkHtml += \"<br><a href=\\\"data:text/csv;charset=UTF-8,\";","            csvDataLinkHtml += encodeURIComponent(csvData);","            csvDataLinkHtml += \"\\\" download=\\\"Export.csv\\\">CSV Export</a></br></span>\" ;","            fp.append(csvDataLinkHtml);","        }","        setTimeout(showDs, 0);","        scope.catHashKeys = function() {","            var hash = '';","            for (var idx in scope.renderedRows) {","                hash += scope.renderedRows[idx].$$hashKey;","            }","            return hash;","        };","        if (opts && opts.customDataWatcher) {","            scope.$watch(opts.customDataWatcher, showDs);","        } else {","            scope.$watch(scope.catHashKeys, showDs);","        }","    };"]},{"action":"insertText","range":{"start":{"row":90,"column":0},"end":{"row":90,"column":1}},"text":"}"}]}]]},"ace":{"folds":[],"scrolltop":833,"scrollleft":0,"selection":{"start":{"row":90,"column":1},"end":{"row":90,"column":1},"isBackwards":false},"options":{"guessTabSize":true,"useWrapMode":false,"wrapToView":true},"firstLineState":{"row":58,"state":"start","mode":"ace/mode/javascript"}},"timestamp":1403638243087,"hash":"a078ffa8aae7424c3d7fb7403c0bc8536e744127"}