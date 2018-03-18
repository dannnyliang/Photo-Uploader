$(document).ready(function () {

  $('#localupload').change(function () { //localupload
    if (this.files) {
      if (resize) {
        resize.destroy()
        resize = null
        $('#photo-wrap').show()
      }
      
      var reader = new FileReader();
      reader.onload = function (e) {
        $('#photo').attr('src', e.target.result)
      }
      reader.readAsDataURL(this.files[0]);
    }
  })

  $('#urlupload').keyup(function (e) {  //urlupload
    if (e.keyCode == 13) {
      if (resize) {
        resize.destroy()
        resize = null
      }
      $('#photo').attr('src', $('#urlupload').val())
      $('#urlupload').val('')
    }
  })

  var resize;
  $('#crop').click(function () { 
    if (resize) {return}

    const photo = document.querySelector('#photo')
    const rect = photo.getBoundingClientRect()
    resize = new Croppie(photo, {
      enableExif: true,
      viewport: { width: rect.width, height: rect.height },
      boundary: { width: rect.width+50, height: rect.height+50 },
      showZoomer: false,
      enableZoomer: false,
      enableResize: true
    });
  
    resize.bind({
      url: $('#photo')[0].src
    })
  })

  let canvas;
  $('a').hide()
  $('#result').click(function () {  
    if ($('canvas')) {
      $('canvas').remove()
    }
    resize.result('rawcanvas').then(function (cvs) {  
      canvas = cvs
      $('#canvas-wrap').append(canvas)
      $('a').show()
    })
    $('#photo-wrap').hide()
  })
  
  
  $('#drawing').click(function () { 
    draw(canvas)
  })
  $('#bluring').click(function () {  
    blur(canvas)
  })

  function draw(canvas) {  
    const ctx = canvas.getContext("2d");
    
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.lineWidth = 10;
    
    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;
    
    function drawing(e, candraw) {
      if (isDrawing && candraw ){

      ctx.strokeStyle = $('#color').val()
      ctx.beginPath();
      // start from
      ctx.moveTo(lastX, lastY);
      // go to
      ctx.lineTo(e.offsetX, e.offsetY);
      ctx.stroke();
      [lastX, lastY] = [e.offsetX, e.offsetY];
      }
    }

    canvas.addEventListener("mousedown", (e) => {
      isDrawing = true;
      [lastX, lastY] = [e.offsetX, e.offsetY];
    });
    canvas.addEventListener("mousemove", (e) => {
      const candraw = $('#drawing')[0].checked
      drawing(e, candraw)
    });
    canvas.addEventListener("mouseup", () => isDrawing = false);
    canvas.addEventListener("mouseout", () => isDrawing = false);
  }

  function blur(canvas) {
    const ctx = canvas.getContext("2d");

    let isDrawing = false;
    let firstX = 0;
    let firstY = 0;

    ctx.fillStyle = "#fff"
    ctx.filter = "blur(5px) opacity(10%)"

    function bluring(e, canblur) {  
      if (isDrawing && canblur) {
      const moveX = e.offsetX - firstX
      const moveY = e.offsetY - firstY
      ctx.fillRect(firstX, firstY, moveX, moveY)
      }
    }

    canvas.addEventListener("mousedown", (e) => {
      isDrawing = true;
      [firstX, firstY] = [e.offsetX, e.offsetY];
    });
    canvas.addEventListener("mousemove", (e) => {
      const canblur = $('#bluring')[0].checked
      bluring(e, canblur)
    });
    canvas.addEventListener("mouseup", () => isDrawing = false);
    canvas.addEventListener("mouseout", () => isDrawing = false);
  }

  if ($('canvas')) {
    $('a').click(function () {
      this.href = $('canvas')[0].toDataURL();
      this.download = 'croped.png';
    });
  }
})

