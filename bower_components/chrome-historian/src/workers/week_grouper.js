// Generated by CoffeeScript 1.7.1
(function() {
  var getWeekStartTime, _ref;

  this.BH = typeof BH !== "undefined" && BH !== null ? BH : {};

  BH.Workers = (_ref = BH.Workers) != null ? _ref : {};

  BH.Workers.WeekGrouper = (function() {
    function WeekGrouper(config) {
      this.config = config;
      this.setStartingWeekDay(this.config.startingWeekDay);
    }

    WeekGrouper.prototype.setStartingWeekDay = function(weekDay) {
      var days;
      days = {
        sunday: 0,
        monday: 1,
        tuesday: 2,
        wednesday: 3,
        thursday: 4,
        friday: 5,
        saturday: 6
      };
      return this.startingDay = days[weekDay.toLowerCase()];
    };

    WeekGrouper.prototype.run = function(visits) {
      var date, foundAndAdded, index, item, out, previousDate, time, visit, week, weekDifference, _i, _j, _k, _len, _len1, _len2;
      out = [];
      for (_i = 0, _len = visits.length; _i < _len; _i++) {
        visit = visits[_i];
        time = getWeekStartTime(new Date(visit.lastVisitTime), this.startingDay);
        foundAndAdded = false;
        for (_j = 0, _len1 = out.length; _j < _len1; _j++) {
          item = out[_j];
          if (time === item.date.getTime()) {
            item.visits.push(visit);
            foundAndAdded = true;
            break;
          }
        }
        if (!foundAndAdded) {
          out.push({
            date: new Date(time),
            visits: [visit]
          });
        }
      }
      out.sort(function(a, b) {
        return b.date - a.date;
      });
      for (index = _k = 0, _len2 = out.length; _k < _len2; index = ++_k) {
        week = out[index];
        if (typeof previousDate !== "undefined" && previousDate !== null) {
          weekDifference = (previousDate - week.date) / 86400000;
          if (weekDifference > 7) {
            date = new Date(previousDate - (7 * 86400000));
            out.splice(index, 0, {
              date: date,
              visits: []
            });
            previousDate = date;
          } else {
            previousDate = week.date;
          }
        } else {
          previousDate = week.date;
        }
      }
      return out;
    };

    return WeekGrouper;

  })();

  getWeekStartTime = function(date, startingDay) {
    var dayDifference;
    if (date.getDay() >= startingDay) {
      dayDifference = date.getDay() - startingDay;
      date.setDate(date.getDate() - dayDifference);
    } else {
      dayDifference = 7 - (startingDay - date.getDay());
      date.setDate(date.getDate() - dayDifference);
    }
    date.setHours(0, 0, 0, 0);
    return date.getTime();
  };

  if (typeof onServer === "undefined" || onServer === null) {
    self.addEventListener('message', function(e) {
      var weekGrouper;
      weekGrouper = new BH.Workers.WeekGrouper(e.data.config);
      return postMessage(weekGrouper.run(e.data.visits));
    });
  }

}).call(this);
