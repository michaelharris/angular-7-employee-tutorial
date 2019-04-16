// DOM constants
const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const imageList = document.getElementById('image-list');
const imageListTemplate = document.getElementById('imageList-template');
const imageCardTemplate = document.getElementById('imageCard-template');
const selectedList = document.getElementById('selected-list');
const selectedPanel = document.getElementById('selected-panel');
const submitButton = document.getElementById('submit-button');
const cancelButton = document.getElementById('cancel-button');

// Front-end constants
const SELECTED_IMAGE_IDS = "selected-image-ids";
const DATA_IMAGE_ID = "data-image-id";
const DATA_IMAGE_TYPE = "data-image-type";
const IMAGE_TYPE_ORIGINAL = "original";
const IMAGE_TYPE_CROPPED = "cropped";

// Back-end constants
const IMAGE_WIDTH_SIZE = 400;
const SERVICE_ENDPOINT = window.location.origin;
const SERVICE_ORIGINAL_RESOURCE = "image";
const SERVICE_PROCESSED_RESOURCE = "processedImage";

Storage.prototype.setObj = function (key, obj) {
  return this.setItem(key, JSON.stringify(obj))
};
Storage.prototype.getObj = function (key) {
  return JSON.parse(this.getItem(key))
};
Storage.prototype.addItemList = function (key, item) {
  let list = this.getObj(key) || [];
  if (!this.containsItemList(key, item)) {
    list.push(item);
    this.setObj(key, list);
  }
};
Storage.prototype.removeItemList = function (key, item) {
  const list = JSON.parse(this.getItem(key));
  _.remove(list, item);
  this.setObj(key, list);
};
Storage.prototype.containsItemList = function (key, item) {
  return _.findIndex(this.getObj(key), item) >= 0;
};

// INIT
// Read selected images from sessionStorage and add them to the panel list
if (sessionStorage.getObj(SELECTED_IMAGE_IDS)) {
  sessionStorage.getObj(SELECTED_IMAGE_IDS).forEach(({ imageId, imageType }) => addImageIdToPanelList(imageId, imageType));
}

// Adding Listeners
addEventListeners(searchForm, 'submit', function (e) {
  e.preventDefault();
  cleanRenderedImages();
  _.split(searchInput.value, ',')
    .filter(e => !_.isEmpty(e))
    .forEach(e => renderImagesById(e));
});

addEventListeners(searchInput, 'change', function (e) {
  e.preventDefault();
  searchInput.value = e.target.value;
});

addEventListeners(submitButton, 'click', function (e) {
  e.preventDefault();
  printResults(sessionStorage.getObj(SELECTED_IMAGE_IDS));
  cleanAllSelectedImageIds();
});

addEventListeners(cancelButton, 'click', function (e) {
  e.preventDefault();
  cleanAllSelectedImageIds();
});


function addImageDimmerEventListeners(imageCard) {
  const dimmer = imageCard.querySelector('div[data-type="dimmer"]');
  const dimmerChild = dimmer.firstElementChild;

  addEventListeners(dimmer, 'mouseover', function (e) {
    e.preventDefault();
    dimmer.classList.add("dimmed");
    dimmerChild.classList.add("active", "transition", "visible");
    dimmerChild.style.cssText = 'display:flex !important'; //changes the display
  });

  addEventListeners(dimmer, 'mouseout', function (e) {
    e.preventDefault();
    dimmer.classList.remove("dimmed");
    dimmerChild.classList.remove("active", "transition", "visible");
    dimmerChild.style.display = ''; //changes the display
  });
}

function addButtonEventListeners(button) {
  addEventListeners(button, 'click', function (e) {
    e.preventDefault();
    const parent = button.closest(".ui.segment");
    parent.classList.toggle("selected");

    const imageId = button.getAttribute(DATA_IMAGE_ID);
    const imageType = button.getAttribute(DATA_IMAGE_TYPE);

    if (parent.classList.contains("selected")) {
      button.innerHTML = "Remove";
      addImageIdToPanelList(imageId, imageType);
      sessionStorage.addItemList(SELECTED_IMAGE_IDS, { imageId: imageId, imageType: imageType });
    } else {
      button.innerHTML = "Add";
      removeImageIdFromPanelList(imageId, imageType);
      sessionStorage.removeItemList(SELECTED_IMAGE_IDS, { imageId: imageId, imageType: imageType });
      if (sessionStorage.getObj(SELECTED_IMAGE_IDS).length === 0) {
        selectedPanel.style.visibility = "hidden";
      }
    }
  });
}

function addImageIdToPanelList(imageId, imageType) {
  const item = document.createElement("div");
  item.id = `${imageType}_${imageId}`;
  item.classList.add("item");
  item.innerHTML = `${imageId} - ${imageType}`;
  item.setAttribute(DATA_IMAGE_TYPE, imageType);
  item.setAttribute(DATA_IMAGE_ID, imageId);
  selectedList.appendChild(item);
  selectedPanel.style.visibility = "visible";
}

function removeImageIdFromPanelList(imageId, imageType) {
  const item = selectedList.querySelector(`#${imageType}_${imageId}`);
  selectedList.removeChild(item);
}

function addEventListeners(el, s, fn) {
  _.split(s, ' ').forEach(e => el.addEventListener(e, fn, false));
}

function renderImagesById(imageId) {
  const row = document.importNode(imageListTemplate.content, true);
  const div = row.querySelector("div.row");
  const originalImage = getImageHtml(imageId, IMAGE_TYPE_ORIGINAL);
  const croppedImage = getImageHtml(imageId, IMAGE_TYPE_CROPPED);

  div.appendChild(originalImage);
  div.appendChild(croppedImage);
  imageList.appendChild(row);
}

function getImageHtml(imageId, imageType) {
  const html = document.importNode(imageCardTemplate.content, true);
  const img = html.querySelector("img");
  img.src = getImageUrl(imageId, imageType, IMAGE_WIDTH_SIZE);
  const a = html.querySelector("a");
  a.href = getImageUrl(imageId, imageType);

  const button = html.querySelector("button");
  button.value = imageId;
  button.setAttribute(DATA_IMAGE_ID, imageId);
  button.setAttribute(DATA_IMAGE_TYPE, imageType);

  if (sessionStorage.containsItemList(SELECTED_IMAGE_IDS, { imageId: imageId, imageType: imageType })) {
    html.querySelector(".ui.segment").classList.toggle("selected");
    button.innerHTML = "Remove";
  }

  addImageDimmerEventListeners(html.firstElementChild);
  addButtonEventListeners(button);
  return html;
}

function cleanRenderedImages() {
  while (imageList.firstChild) {
    imageList.firstChild.remove();
  }
}

function cleanAllSelectedImageIds() {
  while (selectedList.firstChild) {
    selectedList.firstChild.remove();
  }
  imageList.querySelectorAll(".selected").forEach(el => {
    el.classList.toggle("selected");
    el.querySelector("button").innerHTML = "Add";
  });
  sessionStorage.setObj(SELECTED_IMAGE_IDS, []);
  selectedPanel.style.visibility = "hidden";
}

function printResults(data) {
  cleanRenderedImages();
  const h = document.createElement("h3");
  h.innerHTML = "JSON";
  imageList.appendChild(h);

  const pre = document.createElement("pre");
  pre.innerHTML = JSON.stringify(data, undefined, 2);
  imageList.appendChild(pre);
}

function getImageUrl(imageId, imageType, width = 0) {
  const widthParam = (width > 0) ? `?width=${width}` : "";
  const resource = (imageType === IMAGE_TYPE_ORIGINAL) ? SERVICE_ORIGINAL_RESOURCE : SERVICE_PROCESSED_RESOURCE;
  return `${SERVICE_ENDPOINT}/${resource}/${imageId}${widthParam}`;
}