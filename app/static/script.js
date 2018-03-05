window.onload = init;

function init() {
  // Initialization button of add block
  var addTextBlockButton = document.getElementById("add-text-blocks");
  addTextBlockButton.onclick = function() {
    var textBlocksText = document.getElementById("text-blocks-text");
    var text = textBlocksText.value;

    var simpleTextBlock = document.getElementById("simple-text-block");
    var easy = simpleTextBlock.checked;

    controller.addTextBlock(text, easy);
    textBlocksText.value = "";
  };

  // Initialization button of add random text block
  var addRandomBlockButton = document.getElementById("add-random-block");
  addRandomBlockButton.onclick = function() {
    controller.addRandomBlock();
  };

  // Get data from storage if it exists
  model.getDataFromLocalStorage();
  var textBlocks = model.textBlocks;

  // Display existed text blocks
  textBlocks.forEach(function(item) {
    viewer.addTextBlockToDom(item);
  });
}

function TextBlock(text, easy = true, id, color = "green") {
  this.text = text;
  this.id = id;
  this.simple = easy;
  this.color = color;
}

var controller = {
  addTextBlock: function(text, easy = true) {
    if (text.length == 0) {
      alert("Empty text");
    } else {
      var textBlock = model.addTextBlock(text, easy);
      viewer.addTextBlockToDom(textBlock);
    };
    viewer.printQuanitySelectedBlocks();
  },
  deleteTextBlock: function(textBlockDom) {
    viewer.deleteTextBlockFromDOM(textBlockDom)
    model.deleteTextBlock(textBlockDom);
    viewer.printQuanitySelectedBlocks();
  },
  triggerColor: function(textBlockDom) {
    console.log("Test");
    viewer.triggerColor(textBlockDom);
    model.triggerColor(textBlockDom);
  },
  selectBlock: function(textBlockDom) {
    if (textBlockDom.target.nodeName == "LI") {
      if (textBlockDom.target.dataset.blockSelected == "true") {
        textBlockDom.target.setAttribute("data-block-selected", false);
      } else {
        textBlockDom.target.setAttribute("data-block-selected", true);
      };
      viewer.printQuanitySelectedBlocks();
    }
  },
  addRandomBlock: function() {
    var lipsum = new LoremIpsum();
    var text_length = Math.floor((Math.random() * 10) + 4);
    var text = lipsum.generate(text_length);
    var easy = function() {
      var random = Math.random();
      return random > 0.5 ? true : false;
    }();
    this.addTextBlock(text, easy);
  }
}

var viewer = {
  addTextBlockToDom: function(textBlock) {
    var stickies = document.getElementById("text-blocks");
    var sticky = document.createElement("li");
    var span = document.createElement("span");
    var closeButton = document.createElement("button");

    closeButton.setAttribute("class", "close-button")
    closeButton.innerHTML = "X";
    closeButton.onclick = function(e) {
      controller.deleteTextBlock(e.target.parentElement);
    }

    span.setAttribute("class", "sticky");
    span.innerHTML = textBlock.text

    sticky.setAttribute("data-simple-text-block", textBlock.simple);
    sticky.setAttribute("data-block-selected", false);
    sticky.setAttribute("id", textBlock.id);
    if (!textBlock.simple) {
      sticky.setAttribute("class", textBlock.color);
      sticky.ondblclick = function(textBlock) {
        controller.triggerColor(textBlock);
      }
    }

    sticky.onclick = function(e) {
      controller.selectBlock(e);
    }

    sticky.appendChild(closeButton);
    stickies.appendChild(sticky);

    sticky.appendChild(span);
    stickies.appendChild(sticky);
  },
  deleteTextBlockFromDOM: function(textBlock) {
    if (textBlock.dataset.simpleTextBlock == "true") {
      textBlock.remove();
      return true;
    } else {
      if (confirm("Are you sure to delete HardTextBlock?")) {
        textBlock.remove();
        return true;
      }
    };
    return false;
  },
  triggerColor: function(textBlock) {
    if (textBlock.target.className == "green") {
      textBlock.target.className = "red";
    } else {
      textBlock.target.className = "green";
    };
    this.printQuanitySelectedBlocks();
  },
  printQuanitySelectedBlocks: function() {
    // All; Count and print total selected blocks
    var selectedBlocksCount = 0;
    var selectedBlocks = document.querySelectorAll('[data-block-selected="true"]');
    var countSelectedBlocks = document.getElementById("count-selected-blocks");
    selectedBlocksCount = selectedBlocks.length;
    countSelectedBlocks.innerHTML = selectedBlocksCount;

    // Green; Count and print selected green blocks
    var greenBlocks = document.getElementsByClassName("green");
    var greenBlocksCount = 0;

    for (var i = 0; greenBlocks.length > i; i++) {
      if (greenBlocks[i].dataset.blockSelected == "true") {
        greenBlocksCount++;
      }
    }

    var countSelectedGreenBlocks = document.getElementById('count-selected-green-blocks')
    countSelectedGreenBlocks.innerHTML = greenBlocksCount;

    // Red; Count and print selected red blocks
    var redBlocks = document.getElementsByClassName("red");
    var redBlocksCount = 0;

    for (var i = 0; redBlocks.length > i; i++) {
      if (redBlocks[i].dataset.blockSelected == "true") {
        redBlocksCount++;
      }
    }

    var countSelectedRedBlocks = document.getElementById("count-selected-red-blocks");
    countSelectedRedBlocks.innerHTML = redBlocksCount;
  }
}

var model = {
  textBlocks: [],
  addTextBlock: function(text, simple = true) {
    var id = "block_" + Math.floor(Math.random() * 1000000);
    var textBlock = new TextBlock(text, simple, id);
    this.textBlocks.push(textBlock);
    this.saveDataToLocalStorage();
    return textBlock;
  },
  deleteTextBlock: function(textBlock) {
    for (var i = 0; this.textBlocks.length > i; i++) {
      if (this.textBlocks[i].id == textBlock.id) {
        delete this.textBlocks.splice(i, 1);
      }
    };
    this.saveDataToLocalStorage();
  },
  triggerColor: function(textBlock) {
    this.textBlocks.forEach(function(item, i) {
      if (item.id == textBlock.target.id) {
        if (model.textBlocks[i].color == "green") {
          model.textBlocks[i].color = "red";
        } else {
          model.textBlocks[i].color = "green";
        }
      }
    });
    this.saveDataToLocalStorage();
  },
  saveDataToLocalStorage: function() {
    if (typeof(Storage) !== "undefined") {
      var dataString = JSON.stringify(this.textBlocks);
      localStorage.setItem("data_text_blocks", dataString);
    }
  },
  getDataFromLocalStorage: function() {
    if (typeof(Storage) !== "undefined") {
      data_text_blocks_string = localStorage.getItem("data_text_blocks");
      if (data_text_blocks_string != null) {
        this.textBlocks = JSON.parse(data_text_blocks_string);
      }
    }
  }
}
