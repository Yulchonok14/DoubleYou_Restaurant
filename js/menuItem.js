$(function () {

    'use strict';

    var input = document.createElement('input'),
        div = document.createElement('div'),
        img = document.createElement('img'),
        span = document.createElement('span'),
        h3 = document.createElement('h3'),
        p = document.createElement('p'),
        hr = document.createElement('hr');

    function MenuItem(id, sName, name, description, sPrice, lPrice, sPortionName, lPortionName, catSName) {
        this.id = id;
        this.sName = sName;
        this.name = name;
        this.description = description;
        this.sPrice = sPrice || '';
        this.lPrice = lPrice;
        this.sPortionName = sPortionName;
        this.lPortionName = lPortionName;
        this.catSName = catSName;

        this.element = createMenuItem(this);
    }

    function getPortionName(name) {
        if(name !== null){
            return '(' + name + ')';
        }
    }

    function getPrice(price) {
        if(price !== ''){
            return document.createTextNode(' $' + price.toFixed(2));
        } else {
            return document.createTextNode('');
        }
    }

    function clickInputEvent(e) {
        e.preventDefault();
        $(this).blur();
        return false;
    }

    function createMenuItem(item){
        var outerDiv = div.cloneNode(true),
            rowDiv = div.cloneNode(true),
            colDiv = div.cloneNode(true),
            photoDiv = div.cloneNode(true),
            chBoxDiv = div.cloneNode(true),
            priceDiv = div.cloneNode(true),
            descrDiv = div.cloneNode(true),
            chBoxInput = input.cloneNode(true),
            imgItem = img.cloneNode(true),
            sPortionSpan = span.cloneNode(true),
            lPortionSpan = span.cloneNode(true),
            quantInput = input.cloneNode(true),
            descrH3 = h3.cloneNode(true),
            descrP = p.cloneNode(true),
            xsHr = hr.cloneNode(true),
            sPrice = getPrice(item.sPrice),
            lPrice = getPrice(item.lPrice);

        outerDiv.classList.add('menu-item-tile', 'col-md-6');
        rowDiv.classList.add('row');
        colDiv.classList.add('col-sm-5');
        photoDiv.classList.add('menu-item-photo');
        chBoxInput.type = 'checkbox';
        chBoxInput.setAttribute('data-short-name', item.sName);
        imgItem.classList.add('img-responsive');
        imgItem.src = 'images/menu/' + item.catSName + '/' + item.sName + '.jpg';
        imgItem.alt = item.name;
        priceDiv.classList.add('menu-item-price');
        sPortionSpan.textContent = getPortionName(item.sPortionName);
        lPortionSpan.textContent = getPortionName(item.lPortionName);
        quantInput.id = 'quantity';
        quantInput.type = 'number';
        quantInput.value = 1;
        quantInput.minValue = 1;
        quantInput.maxValue = 99;
        quantInput.addEventListener('click', clickInputEvent, false);
        descrDiv.classList.add('menu-item-description', 'col-sm-7');
        descrH3.classList.add('menu-item-title');
        descrH3.textContent = item.name;
        descrP.classList.add('menu-item-details');
        descrP.textContent = item.description;
        xsHr.classList.add('visible-xs');

        chBoxDiv.appendChild(chBoxInput);
        photoDiv.appendChild(chBoxDiv);
        photoDiv.appendChild(imgItem);
        priceDiv.appendChild(sPrice);
        priceDiv.appendChild(sPortionSpan);
        priceDiv.appendChild(lPrice);
        priceDiv.appendChild(lPortionSpan);
        priceDiv.appendChild(quantInput);
        colDiv.appendChild(photoDiv);
        colDiv.appendChild(priceDiv);
        descrDiv.appendChild(descrH3);
        descrDiv.appendChild(descrP);
        rowDiv.appendChild(colDiv);
        rowDiv.appendChild(descrDiv);
        outerDiv.appendChild(rowDiv);
        outerDiv.appendChild(xsHr);

        return outerDiv;
    }

    window.MenuItem = MenuItem;

});