chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'highlightDarkPattern') {
        const darkStrings = request.dark_strings;
        darkStrings.forEach((darkString) => {
            highlightStringInDOM(darkString);
        });
    }
});

function highlightStringInDOM(darkString) {
    const { text, class: type } = darkString;
    const elements = document.getElementsByTagName('*');

    for (let i = 0; i < elements.length; i++) {
        const element = elements[i];
        const children = element.getElementsByTagName('*');
        let isLowestMostElement = true;

        for (let j = 0; j < children.length; j++) {
            if (children[j].innerHTML.includes(text)) {
                isLowestMostElement = false;
                break;
            }
        }

        if (isLowestMostElement && element.innerHTML.includes(text)) {
            element.style.backgroundColor = 'yellow';
            element.style.color = 'red';
            // Add any other style modifications as needed

            // Add tooltip
            const tooltip = document.createElement('span');
            tooltip.textContent = type;
            tooltip.style.position = 'absolute';
            tooltip.style.backgroundColor = 'black';
            tooltip.style.color = 'white';
            tooltip.style.padding = '5px';
            tooltip.style.borderRadius = '5px';
            tooltip.style.zIndex = '9999';
            tooltip.style.visibility = 'hidden'; // Hide the tooltip initially

            element.appendChild(tooltip);

            // Show tooltip on hover
            element.addEventListener('mouseover', () => {
                tooltip.style.visibility = 'visible';
                tooltip.style.top = `${element.offsetTop + element.offsetHeight}px`;
                tooltip.style.left = `${element.offsetLeft}px`;
            });

            // Hide tooltip on mouseout
            element.addEventListener('mouseout', () => {
                tooltip.style.visibility = 'hidden';
            });

            // Show tooltip on hover
            element.addEventListener('mouseover', () => {
                tooltip.style.visibility = 'visible';
            });

            // Hide tooltip on mouseout
            element.addEventListener('mouseout', () => {
                tooltip.style.visibility = 'hidden';
            });
        }
    }
}

// function highlightStringInDOM(darkString) {
//     const {text, class:type} = darkString;
//     const elements = document.getElementsByTagName('*');
  
//     for (let i = 0; i < elements.length; i++) {
//         const element = elements[i];
//         const children = element.getElementsByTagName('*');
//         let isLowestMostElement = true;
        
//         for (let j = 0; j < children.length; j++) {
//             if (children[j].innerHTML.includes(text)) {
//                 isLowestMostElement = false;
//                 break;
//             }
//         }
        
//         if (isLowestMostElement && element.innerHTML.includes(text)) {
//             element.style.backgroundColor = 'yellow';
//             element.style.color = 'red';
//             // Add any other style modifications as needed
            
//         }
//     }
// }
  