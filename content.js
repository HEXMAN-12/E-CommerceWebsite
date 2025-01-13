// console.clear();

let contentTitle;

console.log(document.cookie);
function dynamicClothingSection(ob) {
  let boxDiv = document.createElement("div");
  boxDiv.id = "box";

  let boxLink = document.createElement("a");
  // boxLink.href = '#'
  boxLink.href = "/contentDetails.html?" + ob.id;
  // console.log('link=>' + boxLink);

  let imgTag = document.createElement("img");
  // imgTag.id = 'image1'
  // imgTag.id = ob.photos
  imgTag.src = ob.preview;

  let detailsDiv = document.createElement("div");
  detailsDiv.id = "details";

  let h3 = document.createElement("h3");
  let h3Text = document.createTextNode(ob.name);
  h3.appendChild(h3Text);

  let h4 = document.createElement("h4");
  let h4Text = document.createTextNode(ob.brand);
  h4.appendChild(h4Text);

  let h2 = document.createElement("h2");
  let h2Text = document.createTextNode("rs  " + ob.price);
  h2.appendChild(h2Text);

  boxDiv.appendChild(boxLink);
  boxLink.appendChild(imgTag);
  boxLink.appendChild(detailsDiv);
  detailsDiv.appendChild(h3);
  detailsDiv.appendChild(h4);
  detailsDiv.appendChild(h2);

  return boxDiv;
}

//  TO SHOW THE RENDERED CODE IN CONSOLE
// console.log(dynamicClothingSection());

// console.log(boxDiv)

let mainContainer = document.getElementById("mainContainer");
let containerClothing = document.getElementById("containerClothing");
let containerAccessories = document.getElementById("containerAccessories");
// mainContainer.appendChild(dynamicClothingSection('hello world!!'))

// Add loading indicator
function showLoading() {
  const loadingDiv = document.createElement('div');
  loadingDiv.id = 'loading';
  loadingDiv.innerHTML = '<div class="spinner"></div><p>Loading products...</p>';
  mainContainer.appendChild(loadingDiv);
}

function hideLoading() {
  const loadingDiv = document.getElementById('loading');
  if (loadingDiv) {
    loadingDiv.remove();
  }
}

function showError(message) {
  const errorDiv = document.createElement('div');
  errorDiv.id = 'error';
  errorDiv.innerHTML = `<p>Error: ${message}</p><button onclick="location.reload()">Retry</button>`;
  mainContainer.appendChild(errorDiv);
}

// BACKEND CALLING
showLoading();

let httpRequest = new XMLHttpRequest();

httpRequest.onreadystatechange = function() {
  if (this.readyState === 4) {
    hideLoading();
    if (this.status == 200) {
      try {
        contentTitle = JSON.parse(this.responseText);
        if (document.cookie.indexOf(",counter=") >= 0) {
          var counter = document.cookie.split(",")[1].split("=")[1];
          document.getElementById("badge").innerHTML = counter;
        }
        
        // Clear existing content
        containerClothing.innerHTML = '';
        containerAccessories.innerHTML = '';
        
        if (contentTitle.length === 0) {
          showError('No products available');
          return;
        }

        for (let i = 0; i < contentTitle.length; i++) {
          try {
            if (contentTitle[i].isAccessory) {
              containerAccessories.appendChild(
                dynamicClothingSection(contentTitle[i])
              );
            } else {
              containerClothing.appendChild(
                dynamicClothingSection(contentTitle[i])
              );
            }
          } catch (err) {
            console.error('Error rendering product:', contentTitle[i], err);
          }
        }
      } catch (err) {
        console.error('Error parsing response:', err);
        showError('Failed to load products');
      }
    } else {
      console.error('API call failed:', this.status);
      showError('Failed to fetch products');
    }
  }
};

try {
  httpRequest.open("GET", "/api/products", true);
  httpRequest.send();
} catch (err) {
  console.error('Failed to make request:', err);
  hideLoading();
  showError('Network error');
}

// Add CSS for loading and error states
const style = document.createElement('style');
style.textContent = `
  #loading, #error {
    text-align: center;
    padding: 20px;
    margin: 20px;
  }
  
  .spinner {
    border: 4px solid #f3f3f3;
    border-top: 4px solid #3498db;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    animation: spin 1s linear infinite;
    margin: 20px auto;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  #error {
    color: #721c24;
    background-color: #f8d7da;
    border: 1px solid #f5c6cb;
    border-radius: 4px;
  }
  
  #error button {
    margin-top: 10px;
    padding: 8px 16px;
    background-color: #dc3545;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  
  #error button:hover {
    background-color: #c82333;
  }
`;
document.head.appendChild(style);
