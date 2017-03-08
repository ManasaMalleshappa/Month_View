import React from 'react';
import ReactDOM from 'react-dom';

var Calendar = React.createClass({
    displayName: 'Calendar',
    calc: function (year, month) {
        return {
            firstOfMonth: new Date(year, month, 1),
            daysInMonth: new Date(year, month + 1, 0).getDate()
        };
    },
    componentWillMount: function () {
        this.setState(this.calc.call(null, this.state.year, this.state.month));
    },
    componentDidMount: function () {},

    getInitialState: function () {
        var date = new Date();
        return {
            year: date.getFullYear(),
            month: date.getMonth(),
            selectedYear: date.getFullYear(),
            selectedMonth: date.getMonth(),
            selectedDate: date.getDate(),
            selectedDt: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
            startDay: 1,
            weekNumbers: false,
            minDate: this.props.minDate ? this.props.minDate : null,
            disablePast: this.props.disablePast ? this.props.disablePast : false,
            dayNames: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
            monthNames: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            monthNamesFull: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
            firstOfMonth: null,
            daysInMonth: null
        };
    },
    selectDate: function (year, month, date, element) {
        this.setState({
            selectedYear: year,
            selectedMonth: month,
            selectedDate: date,
            selectedDt: new Date(year, month, date),
            selectedElement: element.target
        });
    },
    render: function () {
        return React.createElement(
            'div',
            { className: 'r-calendar' },
            React.createElement(
                'div',
                { className: 'r-inner' },
                React.createElement(Header, { monthNames: this.state.monthNamesFull, month: this.state.month, year: this.state.year }),

                React.createElement(WeekDays, { dayNames: this.state.dayNames, startDay: this.state.startDay, weekNumbers: this.state.weekNumbers }),

                React.createElement(MonthDates, { month: this.state.month, year: this.state.year, daysInMonth: this.state.daysInMonth, firstOfMonth: this.state.firstOfMonth, startDay: this.state.startDay, onSelect: this.selectDate, weekNumbers: this.state.weekNumbers, disablePast: this.state.disablePast, minDate: this.state.minDate })
            )
        );
    }
});

var Header = React.createClass({
    displayName: 'Header',

    render: function () {
        return React.createElement(
            'div',
            {},
            React.createElement(
                'div',
                { className: 'r-cell r-title' },
                this.props.monthNames[this.props.month],  //March
                ' ',
                this.props.year //2017
            )
        );
    }
});

var WeekDays = React.createClass({
    displayName: 'WeekDays',

    render: function () {
        var that = this,
        stack = Array.apply(null, { length: 7 }).map(Number.call, Number);    // {0,1,2,3,4,5,6}
        return React.createElement(
            'div',
            { className: 'r-row r-weekdays' },
            (() => {
                if (that.props.weekNumbers) {
                    return React.createElement(
                        'div',
                        {},
                        'wn'
                    );
                }
            })(),
            stack.map(function (item, i) {
                return React.createElement(
                    'div',
                    { className: 'r-cell' },
                    that.props.dayNames[(that.props.startDay + i) % 7]  //Mon,Tue,Wed,Thu,Fri,Sat
                );
            })
        );
    }
});


var MonthDates = React.createClass({
    displayName: 'MonthDates',

    render: function () {
        var stack,
            day,
            d,
            current,
            onClick,
            isDate,
            className,
            weekStack = Array.apply(null, { length: 7 }).map(Number.call, Number),
            that = this,
            startDay = this.props.firstOfMonth.getUTCDay(),
            first = this.props.firstOfMonth.getDay(),
            janOne = new Date(that.props.year, 0, 1),
            rows = 5;

        if (startDay == 5 && this.props.daysInMonth == 31 || startDay == 6 && this.props.daysInMonth > 29) {
            rows = 6;
        }

        className = rows === 6 ? 'r-dates' : 'r-dates r-fix';
        stack = Array.apply(null, { length: rows }).map(Number.call, Number);
        day = this.props.startDay + 1 - first;
        while (day > 1) {
            day -= 7;
        }
        day -= 1;
        return React.createElement(
            'div',
            { className: className },
            stack.map(function (item, i) {
                d = day + i * 7;
                return React.createElement(
                    'div',
                    { className: 'r-row' },
                    (() => {
                        if (that.props.weekNumbers) {
                            var wn = Math.ceil(((new Date(that.props.year, that.props.month, d) - janOne) / 8.64e7 + janOne.getDay() + 1) / 7);
                            return React.createElement(
                                'div',
                                { className: 'r-cell r-weeknum' },
                                wn
                            );
                        }
                    })(),
                    weekStack.map(function (item, i) {
                        d += 1;
                        isDate = d > 0 && d <= that.props.daysInMonth;

                        if (isDate) {
                            current = new Date(that.props.year, that.props.month, d);
                            className = current != that.constructor.today ? 'r-cell r-date' : 'r-cell r-date r-today';

                            return React.createElement(
                                'div',
                                { className: className, onClick: that.props.onSelect.bind(that, that.props.year, that.props.month, d) },
                                d
                            );
                        }

                        return React.createElement('div', { className: 'r-cell' });
                    })
                );
            })
        );
    }
});

export default Calendar;