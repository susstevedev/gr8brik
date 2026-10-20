function tooltip(text) {
    const existing_tooltip = document.getElementById('tooltip');

    if(existing_tooltip) {
        existing_tooltip.remove();
    }

    const tooltip = document.createElement('div');

    if (tooltip) {
        tooltip.innerHTML = text;
        tooltip.setAttribute('id', 'tooltip');

        document.body.appendChild(tooltip);

        setTimeout(() => {
            tooltip.remove();
        }, 5500);
    }
}

function tooltipAlert(title, text, additionalText, buttonText) {
    const tooltip = document.createElement('div');
    const tooltipTitle = document.createElement('h4');
    const tooltipText = document.createElement('p');
    const tooltipTextAdditional = document.createElement('p');
    const tooltipExit = document.createElement('button');

    tooltipTitle.textContent = title;
    tooltipText.textContent = text;
    tooltipTextAdditional.textContent = additionalText;
    tooltipExit.textContent = buttonText;

    tooltipTitle.setAttribute('class', 'title');
    tooltipExit.setAttribute('class', 'btn');

    tooltip.appendChild(tooltipTitle);
    tooltip.appendChild(tooltipText);
    tooltip.appendChild(tooltipTextAdditional);
    tooltip.appendChild(tooltipExit);

    tooltip.setAttribute('id', 'tooltipAlert');
    tooltip.setAttribute('class', 'trans');
    document.body.appendChild(tooltip);

    if (tooltip && tooltipExit) {
        tooltipExit.addEventListener('click', function () {
            tooltip.remove();
        }, false);
    }
}

export { tooltip, tooltipAlert };