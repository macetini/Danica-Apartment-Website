/**
 * datePicker.js
 * 
 * Created by Marko Cetinić
 * 
 * Free for all :)
 */

// 0 - look
// 1 - choose start

window.mode = 0;

window.startDate = undefined;
window.endDate = undefined;

window.invalidDate = false;

window.currentDates = new Array;

window.WHITE_COLOR = "white";
window.RED_COLOR = "red";
window.DARK_BLUE_COLOR = "#193969";
window.LIGHT_SKY_BLUE_COLOR = "#A4D3EE";

function markYearSelection(selectedYear, oldSelectedYear)
{
    $(selectedYear).removeClass('inctiveYear');
    $(selectedYear).addClass('activeYear');

    $(oldSelectedYear).removeClass('activeYear');
    $(oldSelectedYear).addClass('inctiveYear');
}

function setInitMode()
{
    window.mode = 0;

    window.startDate = undefined;
    window.endDate = undefined;

    window.invalidDate = false;

    window.currentDates = new Array;
}

function setCallendarLoading()
{
    $('#loadGif').removeClass("notLoadingImg");
    $('#mainWindow').addClass("yearChangeLoading");
}

function setCallendarNotLoading()
{
    $('#loadGif').addClass("notLoadingImg");
    $('#mainWindow').removeClass("yearChangeLoading");
}

function calendarLoaded() {

    setCallendarNotLoading();

    setInitMode();
}

$('#thisYear').live("click", function() {

    if ($(this).hasClass('activeYear') || $('#mainWindow').hasClass('yearChangeLoading') || window.popUp)
        return;

    markYearSelection('#thisYear', '#nextYear');

    setCallendarLoading();

    var currYear = new Date().getFullYear().toString();

    var data = {
        year: currYear
    };

    callAjaxLoad('data/datePicker.php', '#mainWindow', data, null, calendarLoaded);
});

$('#nextYear').live("click", function() {

    if ($(this).hasClass('activeYear') || $('#mainWindow').hasClass('yearChangeLoading') || window.popUp)
        return;

    markYearSelection('#nextYear', '#thisYear');

    setCallendarLoading();

    var nexYear = (new Date().getFullYear() + 1).toString();

    var data = {
        year: nexYear
    };

    callAjaxLoad('data/datePicker.php', '#mainWindow', data, null, calendarLoaded);
});

function markMonthAndPriceActive()
{
    var centerElems = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

    var currYear = Number($('.activeYear').text());

    var i;
    var monthNumb;
    var yearNumb;

    for (i = 0; i < window.currentDates.length; i++)
    {
        monthNumb = Number((window.currentDates[i]).substring(4, 6));

        yearNumb = Number((window.currentDates[i]).substring(0, 4));

        if (yearNumb === currYear)
        {
            if ($("#" + window.currentDates[i]).hasClass('disabledDay'))
                centerElems[monthNumb] = 2;
            else
            if (centerElems[monthNumb] !== 2)
                centerElems[monthNumb] = 1;
        } else {
            if ($("#" + window.currentDates[i]).hasClass('disabledDay'))
                centerElems[12] = 2;
            else
            if (centerElems[12] !== 2)
                centerElems[12] = 1;
        }
    }

    var bgColor;
    var color;

    for (i = 0; i < centerElems.length; i++)
    {
        switch (centerElems[i])
        {
            case 0:
                bgColor = window.DARK_BLUE_COLOR;
                color = window.WHITE_COLOR;
                break;
            case 1:
                bgColor = window.WHITE_COLOR;
                color = window.DARK_BLUE_COLOR;
                break;
            case 2:
                bgColor = window.RED_COLOR;
                color = window.DARK_BLUE_COLOR;
                break;
        }

        $("#monthNumb" + i).css("background-color", bgColor);
        $("#monthNumbSpan" + i).css("color", color);

        $("#monthName" + i).css("background-color", bgColor);
        $("#monthNameSpan" + i).css("color", color);

        $("#price" + i).css("background-color", bgColor);
        $("#priceSpan" + i).css("color", color);
    }
}

function markAllDaysBetweenTwoDates(startDateStr, endDateStr, bgColor, color) {

    var endDate = convertDateStrToDateObj(endDateStr);
    var startDate = convertDateStrToDateObj(startDateStr);

    if (bgColor === undefined)
        bgColor = window.WHITE_COLOR;

    if (color === undefined)
        color = window.DARK_BLUE_COLOR;

    var newCurrentDates = new Array();

    if (startDate >= endDate)
    {
        setDateOneOfActive(startDateStr);

        newCurrentDates.push(startDateStr);

        return newCurrentDates;
    }

    newCurrentDates.push(startDateStr);

    var numOfDaysCount = 0;

    var helperDateStr;

    window.invalidDate = false;

    do {
        helperDateStr = startDate.getFullYear().toString() + zeroPad(startDate.getMonth().toString()) + zeroPad(startDate.getDate().toString());

        if (helperDateStr !== window.startDate && helperDateStr !== window.endDate)
        {
            if ($("#" + helperDateStr).hasClass('disabledDay'))
            {
                window.invalidDate = true;

                $("#" + helperDateStr).css("opacity", 0.7);
                $("#" + helperDateStr).css("background-color", window.RED_COLOR);
            }
            else
                $("#" + helperDateStr).css("background-color", bgColor);

            $("#" + helperDateStr).css("color", color);

            newCurrentDates.push(helperDateStr);
        }

        startDate.setDate(startDate.getDate() + 1);

        numOfDaysCount++;

    } while (startDate <= endDate);

    return newCurrentDates;
}

function clearAllDates()
{
    var currYear = Number($('.activeYear').text());

    $('#reserveBtn').addClass('disabledDay');

    var startDate = convertDateStrToDateObj(currYear.toString() + "0001");
    var endDate = convertDateStrToDateObj((currYear + 1).toString() + "0131");

    var helperDateStr;

    do {
        helperDateStr = startDate.getFullYear().toString() + zeroPad(startDate.getMonth().toString()) + zeroPad(startDate.getDate().toString());

        $("#" + helperDateStr).css("background-color", window.DARK_BLUE_COLOR);
        $("#" + helperDateStr).css("color", window.WHITE_COLOR);

        startDate.setDate(startDate.getDate() + 1);

    } while (startDate <= endDate);
}

$(".day").live("mouseover", function() {

    if ($('#mainWindow').hasClass('yearChangeLoading') || window.popUp)
        return;

    if (window.mode === 0)
    {
        var found = false;

        for (var i = 0; i < window.currentDates.length; i++)
        {
            if (window.currentDates[i] === this.id)
            {
                found = true;
                break;
            }
        }

        if (found)
            return;
        else
            setDateActive(this.id);

    } else {

        var newDates = markAllDaysBetweenTwoDates(window.startDate, this.id);

        clearOuterDates(newDates, window.currentDates);

        window.currentDates = newDates;

        markMonthAndPriceActive();

        calculateStats(window.currentDates);
    }
});

$(".day").live("mouseleave", function() {

    if ($('#mainWindow').hasClass('yearChangeLoading') || window.popUp)
        return;

    if (window.mode === 0)
    {
        var found = false;

        for (var i = 0; i < window.currentDates.length; i++)
        {
            if (window.currentDates[i] === this.id)
            {
                found = true;
                break;
            }
        }

        if (found)
            return;
        else
            setDateInActive(this.id);
    }
});

$(".day").live("click", function() {

    if ($(this).hasClass('disabledDay') || $('#mainWindow').hasClass('yearChangeLoading') || window.popUp)
        return;

    if (window.mode === 0 || convertDateStrToDateObj(window.startDate) > convertDateStrToDateObj(this.id))
    {
        window.mode = 1;

        clearAllDates();

        window.endDate = undefined;
        window.startDate = this.id;

        window.invalidDate = false;

        window.currentDates = new Array;
        window.currentDates.push(window.startDate);
        calculateStats(window.currentDates);

    } else {
        if (this.id === window.startDate)
        {
            window.mode = 0;

            clearAllDates();

            window.startDate = undefined;
            window.invalidDate = false;

            window.currentDates = new Array;

            calculateStats(window.currentDates);

            markMonthAndPriceActive();

            setDateActive(this.id);

            return;
        }

        if (window.invalidDate)
            return;

        $('#reserveBtn').removeClass('disabledDay');

        window.endDate = this.id;
        window.mode = 0;
    }

    markMonthAndPriceActive();
    setDateActive(this.id);
});

$('#reserveBtn').live('click', function() {

    if ($(this).hasClass('disabledDay'))
        return;

    $.get("data/reservePopUp.php", function(data) {

        $('#datePicker').append('<div> </div>');

        window.popUp = $('#datePicker').children().last();

        window.popUp.addClass('popUpReserve').html(data);

        updatePage();

    });
});