/* Copyright (c) 2013 David Capello
   Released under the MIT License */

(function(window, undefined) {

function prettyAnnotations(pre) {
  // Create annotations for all <pre> elements.
  if (pre === undefined) {
    var pres = window.document.getElementsByTagName('pre');
    for (var i=0; i<pres.length; ++i)
      prettyAnnotations(pres[i]);
    return;
  }

  var col = 0;
  function updateCol(span) {
    var cols = span.textContent.split('\n');
    if (cols.length > 1)
      col = 0;
    col += cols[cols.length-1].length;
  }

  var removeSpans = [];
  var spans = pre.getElementsByTagName('span');
  for (var j=0; j<spans.length; ++j) {
    if (spans[j].className == "com") {
      var span = spans[j];
      var fullComment = parseComment(span);
      if (fullComment) {
        var firstCommentCol = col;
        updateCol(spans[j]);

        var removeSpansPossible = [];
        var plnCount = 0;
        for (++j; j< spans.length; ++j) {
          if (spans[j].className == "pln" &&
              spans[j].textContent.trim() == '') {
            updateCol(spans[j]);

            ++plnCount;
            if (plnCount > 1)
              removeSpansPossible.push(spans[j]);
            fullComment += "\n"
          }
          else if (spans[j].className == "com") {
            if (col != firstCommentCol) {
              removeSpansPossible = []
              --j;
              break;
            }

            removeSpans = removeSpans.concat(removeSpans, removeSpansPossible);
            removeSpansPossible = [];

            updateCol(spans[j]);

            var more = parseComment(spans[j]);
            if (more != null) {
              removeSpans.push(spans[j]);
              fullComment += more;
            }
            else {
              --j;
              break;
            }
          }
          else {
            --j;
            break;
          }
        }

        span.className += " annotation";
        span.textContent = fullComment;
      }
    }
    else
      updateCol(spans[j]);
  }

  for (var i=0; i<removeSpans.length; ++i)
    removeSpans[i].remove();
}

function parseComment(span) {
  var m = span.textContent.match(/^([*\/;#^<!-]+)((.|[\r\n])*)/);
  if (m) {
    span.className = "";
    if (m[1] && m[1].match("\\^")) {
      span.className += " annotation-top";
    }
    return m[2].trim().replace(/[*\/;#->\r\n\t ]*$/, "");
  }
  else
    return null;
}

window.prettyAnnotations = prettyAnnotations;
})(window);
