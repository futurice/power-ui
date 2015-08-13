$(function() {
  // Helpers
  var stripValRegex = /[^0-9\.]/g;
  var formatNumber = function(number) {
    return Math.round(number || 0).toString().replace(
      /\B(?=(\d{3})+(?!\d))/g, ","
    );
  };

  // Add calculation of mean
  jQuery.fn.dataTable.Api.register('mean()', function (weights) {
    var data = this.flatten();
    var total_weight = 0;
    var index = 0;
    var sum = data.reduce(function (a, b) {
        // cast values in-case they are strings
        var weight = (weights[index++].replace(stripValRegex, '')*1) || 0;
        if (b !== '') {
          total_weight += weight;
        }
        b = b.replace(stripValRegex, '');
        return a + (b*weight);
    }, 0);

    if (total_weight) {
      return sum / total_weight;
    } else {
      return 0;
    }
  });

  // Add calculation of sum
  jQuery.fn.dataTable.Api.register('sum()', function () {
      return this.flatten().reduce( function ( a, b ) {
        b = b.replace(stripValRegex, '');
        return (a*1) + (b*1); // cast values in-case they are strings
      }, 0);
  });

  /* Initialize data tables */
  var table = $('.table-data-table').dataTable({
    paging: false,
    info: false,
    stateSave: true,
    // Keep state for 5 mins
    stateDuration: 5 * 60,
    order: [],
    language: {
      sSearch: '',
      searchPlaceholder: 'Filter',
    },
    "fnInitComplete": function(oSettings, json) {
      setTimeout(function () {$('.table-data-table').fadeTo("slow" , 1.0); }, 0);
    },
    footerCallback: function(row, data, start, end, display) {
      var api = this.api();
      $(row).children('td').each(function (index, value) {
        var footer = $(api.column(index).footer());
        var columnData = api.cells(display, index).data();

        var weightCol = $(value).attr('data-table-weight-col');
        var weights = [];
        if (weightCol) {
          weights = api.cells(display, weightCol).data();
        }

        switch($(value).attr('data-table-summary')) {
          case 'count':
            footer.html(formatNumber(columnData.length));
            break;
          case 'sum':
            footer.html(formatNumber(columnData.sum()));
            break;
          case 'mean':
            footer.html(formatNumber(columnData.mean(weights)));
            break;
        }
      });
    },
  });

  // Add fixed headers
  if (table.length > 0) {
    var fixedHeader = new $.fn.dataTable.FixedHeader(table, {
      offsetTop: 50,
    });

    // Redraw on resize
    $(window).resize(function () {
      fixedHeader._fnUpdateClones(true); // force redraw
      fixedHeader._fnUpdatePositions();
    });
  }

  // Handle cookies
  $('input[data-store-cookie][type=text]')
    .each(function() {
      // Set checked for if the cookie is stored
      if ($.cookie(this.name)) {
        $(this).val($.cookie(this.name));
      }
    })
    .change(function(event) {
      // Store cookie on change
      if (event.target.value && isValidDate(event.target.value) ) {
        $.cookie(event.target.name, event.target.value,
                 {expires: $(event.target).attr('data-store-cookie')*1, path: '/'});
      } else {
        $.removeCookie(event.target.name, {path: '/'});
      }
    });

  $('input[data-store-cookie][type=radio]')
    .each(function() {
      // Set checked for if the cookie is stored
      if ($.cookie(this.name) === this.value || (!this.value && !$.cookie(this.name))) {
        $(this).prop('checked', true);
      }
    })
    .click(function(event) {
      // Store cookie on click
      if (event.target.value) {
        $.cookie(event.target.name, event.target.value,
                 {expires: $(event.target).attr('data-store-cookie')*1, path: '/'});
      } else {
        $.removeCookie(event.target.name, {path: '/'});
      }
    });

    // Add datepicker
    var today = new Date();
    var monthString = today.getFullYear() + '-' + (today.getMonth() + 1);
    $('.datepicker-month').datepicker({
      format: 'yyyy-mm',
      viewMode: 'months',
      minViewMode: 'months',
      autoclose: true,
    })
    .attr('placeholder', monthString)
    .change(function() {
      if(isValidDate(this.value)) {
        location.reload();
      }
      else {
        this.value = monthString;
      }
    });

    function isValidDate(dateString) {
      year = parseInt(dateString.split('-')[0]);
      month = parseInt(dateString.split('-')[1]);
      if(year > 1900 && year < 2100 && month && month <= 12) {
        return true;
      }
      return false;
    }
    // Initialize tooltips
    $('[data-toggle="tooltip"]').tooltip();

});

$('.cell-edit a').add('.panel-body a').click(function() {
  var name = this.id.replace(/^(change|add|delete)_/, '');
  name = id_to_windowname(name);
  var href = this.href;
  var w = window.innerWidth * 0.8;
  var h = window.innerHeight * 0.8;
  if(window.screen.left !==undefined) {
    var l = window.screen.left + ((window.innerWidth / 2) - (w / 2));
  }
  else {
    var l = screenLeft + ((window.innerWidth / 2) - (w / 2));
  }
  if(window.screen.top !==undefined) {
    var t = window.screen.top + ((window.innerHeight / 2) - (h / 2)) + 50;
  }
  else {
    var t = screenTop + ((window.innerHeight / 2) - (h / 2)) + 50;
  }
  var win = window.open(href, name, 'height=' + h + ', width=' + w + ', left=' + l + ', top=' + t +', resizable=yes, scrollbars=yes');
  win.focus();
  return false;
})

function id_to_windowname(text) {
    text = text.replace(/\./g, '__dot__');
    text = text.replace(/\-/g, '__dash__');
    return text;
}
