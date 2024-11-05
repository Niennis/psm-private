function stringToHTML(str) {
  var dom = document.createElement('div');
  dom.innerHTML = str;
  return dom;
};

var INDEX = 0;
var SESSION = "None";

const scriptElement = document.querySelector('script[data-args]');

var args;
if (scriptElement) {
  const dataArgs = scriptElement.getAttribute('data-args');
  args = dataArgs.split(',');
}

const title = args[0];
const backGroundColor = args[1];
const buttonColor = args[2];
const iconPath = args[3];

const backGroundColorOpacity10 = "#A5C8FF";

var style = document.createElement('style');
style.innerHTML = ` 
        .bot-chat-open {
            position: fixed;
            bottom: 49px;
            right: 50px;
            display: flex;
            align-items: center;
            z-index: 9900;
        }

        #bot-chat-circle {
            position: relative;
            background: #fff;
            width: 72px;
            height: 72px;
            border-radius: 50%;
            border: 1px solid ${backGroundColor};
            color: white;
            padding: 8px;
            cursor: pointer;
            filter: drop-shadow(0px 4px 10px rgba(0, 74, 120, 0.15));
        }
        #chat-circle-img {
            max-width: 100%;
            max-height: 100%;
        }

        .bot-chat-bubble-msg {
            position:relative;
            background:#fff;
            padding:14px 23px;  
            color:${backGroundColor};
            filter: drop-shadow(0px 4px 10px rgba(0, 74, 120, 0.15));
            margin-right:8px; 
            border-radius:16px 16px 8px 16px;
            cursor: pointer;
            font-family: 'brandon-grotesque',sans-serif;  
            font-size: 17px;
            font-style: normal;
            font-weight: bold;
            text-transform: uppercase;
            display: none;
        }

        .bot-header-title {
            margin-bottom: 0;
            color: #004976FF;
            font-family: 'Dollop Serif Expanded',sans-serif;
            font-size: 24px;
            line-height: 24px;
            // text-transform: uppercase;
        }

        #expand-btn, #reduce-btn {
            cursor: pointer;
        }

        .bot-chat-btn {
            display: flex;
            justify-content: center;
            width: 178px;
            background-color: ${backGroundColor};
            border: ${backGroundColor} solid 1px;
            color: #fff;
            border-radius: 32px;
            padding: 12px;
            font-family: 'brandon-grotesque',sans-serif;  
            font-size: 17px;
            font-style: normal;
            font-weight: 500;
            line-height: 100%;
            text-transform: uppercase;
            text-decoration: none;
        }
        .bot-chat-btn:hover{
            background-color: ${backGroundColor};
            border-color: ${backGroundColor};
        }
        .bot-chat-btn:active{
            background-color: ${buttonColor};
        }
        .bot-chat-btn:focus{
            background-color: ${buttonColor};
            border-color: ${backGroundColor};
        }
        .bot-chat-btn:disabled,
        .bot-chat-btn[disabled]{
            cursor: not-allowed;
            background-color: ${backGroundColorOpacity10};
            color: #004976FF;
        }      

        .bot-recipe-btn {
            position: relative;
            border: 1px solid ${backGroundColor};
            background-color: #FCF6E9;
            color: #004976FF;
            max-height: 60px;
            border-radius: 8px;
            padding: 8px;

            font-family: Arial;
            font-size: 16px;
            font-style: normal;
            font-weight: 700;
            line-height: normal;
            text-decoration: none;
        }
        .bot-recipe-btn::before {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
        }
        .bot-recipe-btn:hover{
            background-color: ${backGroundColor};
            border-color: ${backGroundColor};
            color: white;
        }
        .bot-recipe-btn:hover img{
            filter: grayscale(100%) brightness(100%) invert(100%);
        }
        .bot-recipe-btn:active{
            background-color: ${buttonColor};
        }
        .bot-recipe-btn:focus{
            background-color: ${buttonColor};
            border-color: ${backGroundColor};
        }
        .bot-recipe-btn:disabled,
        .bot-recipe-btn[disabled]{
            cursor: not-allowed;
            background-color: #fff;
            color: #6e6e6e;
            font-size: 12px;
        }
        .bot-recipe-btn-time {
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            margin-top: 8px;
            font-family: Arial;
            font-size: 12px;
            font-style: italic;
            font-weight: 400;
            line-height: normal;
            gap: 4px;
        }

        .bot-chat-btn-snd {
            border-color: ${backGroundColor};
            border-style: solid;
            border-width: 2px;
            background-color: #fff;
            color: #6e6e6e;
            width: 150px; 
            font-size: 12px;
            border-radius: 15px;
        }
        .bot-chat-btn-snd:hover{
            background-color: ${backGroundColor};
            border-color: ${backGroundColor};
        }
        .bot-chat-btn-snd:active{
            background-color: ${buttonColor};
        }
        .bot-chat-btn-snd:focus{
            background-color: ${buttonColor};
            border-color: ${backGroundColor};
        }

        .bot-chat-href {
            font-weight: bold;
            color: #a1a1a1;
            text-decoration: none;
        }
        .bot-chat-href:hover {
            font-weight: bold;
            color: ${backGroundColor};
            text-decoration: none;
        }

        .bot-chat-box {
            display:none;
            background:#FFFFFF;
            position:fixed;
            right:100px;
            bottom:113px;  
            width:497px;
            max-height:100vh;
            border-radius:24px;  
            box-shadow: 0px 4px 30px 0px rgba(0, 73, 118, 0.25);
            z-index:100;
            margin: 0 auto;
            transform: scale(0);
            transition: transform 0.3s ease-in-out, height 0.5s, bottom 0.5s, width 0.5s;
            transform-origin: 100% bottom
        }

        .bot-chat-box-toggle {
            margin-right: 0px;
            right: 8px;
            font-size: 35px;
            font-family: 'Type';
            position: absolute;
            cursor: pointer;
        }
        .bot-chat-box-header {
            display: flex;
            align-items: center;
            background: ${backGroundColor};
            border: 1px solid white;
            border-top-left-radius:24px;
            border-top-right-radius:24px;
            color:#FAD70BFF;
            text-align:left;
            padding:16px;            
        }
        .bot-chat-box-sub {
            flex: 1;
            margin: 0px 14px;
            color: #FAD70BFF;
            font-size: 16px;
        }

        .bot-chat-box-avatar {
            width:48px;
            height:50px;
            border:none;  
            overflow: hidden;
            content:url(${iconPath});
            z-index:auto;
        }
        .bot-chat-box-body {
            position: relative;  
            height:62%;
            overflow: hidden;
        }
        .bot-chat-box-body:after {
            content: "";
            opacity: 0.1;
            top: 0;
            left: 0;
            bottom: 0;
            right: 0;
            height:100%;
            position: absolute;
            z-index: -1;   
        }

        #bot-chat-input {
            bottom: 0;
            background: #fff;
            width:94%; 
            position:relative;
            height:48px;
            margin:14px 16px;
            padding:15px 48px 15px 24px;
            resize:none;
            outline:none;
            border:1px solid ${backGroundColor};
            color:#004976FF;
            border-radius:9999px;
            overflow:hidden;  
        }
        .bot-chat-input > form {
            position: relative;
            margin-bottom: 0;
        }
        #bot-chat-input::-webkit-input-placeholder { /* Chrome/Opera/Safari */
            color: #ccc;
        }
        #bot-chat-input::-moz-placeholder { /* Firefox 19+ */
            color: #ccc;
        }
        #bot-chat-input:-ms-input-placeholder { /* IE 10+ */
            color: #ccc;
        }
        #bot-chat-input:-moz-placeholder { /* Firefox 18- */
            color: #ccc;
        }
        .bot-chat-submit {  
            position:absolute;
            bottom:32px;
            right:42px;
            background: transparent;
            box-shadow:none;
            border:none;
            border-radius:50%;
            color: ${backGroundColor};
            width:16px;
            height:16px;  
        }

        .bot-chat-logs {
            padding:16px; 
            height:350px;
            overflow-y:scroll;
            margin-bottom:10px;
        }

        .bot-chat-logs::-webkit-scrollbar-track
        {
            -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
            box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
            background-color: #F5F5F5;
        }
        
        .bot-chat-logs::-webkit-scrollbar
        {
            width: 5px;  
            background-color: #F5F5F5;
        }
        
        .bot-chat-logs::-webkit-scrollbar-thumb
        {
            background-color: ${backGroundColor};
        }

        .bot-cm-msg-text {
            background:#FCF6E9FF;
            padding:16px;  
            color:#004976FF;
            float:left;
            margin-left:16px; 
            position:relative;
            border-radius:24px;
            font-family: Arial;
            font-size: 16px;
            font-style: normal;
            font-weight: 400;
            line-height: normal;
        }

        .bot-cm-msg-text > p {
            margin: 0px;
            font-size: inherit;
        }

        .bot-chat-msg {
            margin:16px 0px;
            clear:both;    
            display: flex;
            flex-direction: row;
            flex-wrap: nowrap;
        }
        .bot-chat-msg.self {
            margin-left:20px;
            flex-direction: row-reverse;
        }
        .bot-chat-msg.user {
            margin-right:20px;
        }
        .bot-chat-msg.self > .bot-cm-msg-text {  
            float:right;
            margin-right:16px;
            background: ${backGroundColorOpacity10};
            color: #004976FF;
        }
        .bot-chat-msg.user .bot-cm-msg-text {
            border-bottom-left-radius:8px;
        }
        .bot-chat-msg.self .bot-cm-msg-text {
            border-bottom-right-radius:8px;
        }
        .bot-chat-msg.user > .bot-msg-avatar img {
            float:left;
        }
        .bot-chat-msg.self > .bot-msg-avatar img {
            float:right;
        }

        .bot-msg-avatar {
            align-self: flex-end;
            width:32px;
            height:32px;
            border-radius:50%;
        }

        .bot-cm-msg-button>ul>li {
            list-style:none;
            float:left;
            margin: 8px;
        }
        .bot-cm-msg-button {
            clear: both;
            float:center;
        }
    
        .bot-modal {
            display: contents; 
            position: fixed; /* Stay in place */
            z-index: 1; /* Sit on top */
            left: 0;
            top: 0;
            width: 100%; /* Full width */
            height: 100%; /* Full height */
            overflow: auto; /* Enable scroll if needed */
            background-color: rgb(0,0,0); /* Fallback color */
            background-color: rgba(0,0,0,0.4); /* Black w/ opacity */
        }
          
          /* Modal Content/Box */

        .bot-modal-content {
            background-color: #fefefe;
            position: relative;
            margin: 0% auto; /* 15% from the top and centered */
            padding: 2px;
            border: 1px solid #888;
            width: 90%; /* Could be more or less, depending on screen size */
        }
          
        /* The Close Button */
        .bot-close-video {
            color: #fff;
            float: right;
            font-size: 28px;
            font-weight: bold;
            font-family: 'Type';
            top: 3px;
            position: absolute;
            left: 5px;
            display:none;
            text-shadow: 1px 0 0 #aaa, -1px 0 0 #aaa, 0 1px 0 #aaa, 0 -1px 0 #aaa, 1px 1px #aaa, -1px -1px 0 #aaa, 1px -1px 0 #aaa, -1px 1px 0 #aaa;

        }
          
        .bot-close-video:hover,
        .bot-close-video:focus {
            color: ${buttonColor};
            text-decoration: none;
            cursor: pointer;
        }

        .bot-open-video {
            color: #fff;
            float: right;
            font-size: 28px;
            font-family: 'Type';
            font-weight: bold;
            top: 3px;
            position: absolute;
            left: 1px;
            text-shadow: 1px 0 0 #aaa, -1px 0 0 #aaa, 0 1px 0 #aaa, 0 -1px 0 #aaa, 1px 1px #aaa, -1px -1px 0 #aaa, 1px -1px 0 #aaa, -1px 1px 0 #aaa;
        }
        
        .bot-chat-send {
            fill: ${buttonColor}; 
        }
        .bot-chat-icon {
            fill: #ffffff; 
        }       
        .bot-open-video:hover,
        .bot-open-video:focus {
            color: ${buttonColor};
            text-decoration: none;
            cursor: pointer;
        }

        * {box-sizing:border-box}

        /* Slideshow container */
        .bot-slideshow-container {
          max-width: 1000px;
          position: relative;
          margin: auto;
        }
        
        /* Hide the images by default */
        .bot-mySlides {
          display: none;
        }
        
        /* Next & previous buttons */
        .bot-prev-car, .bot-next-car {
          cursor: pointer;
          position: absolute;
          top: 50%;
          width: auto;
          margin-top: -22px;
          padding: 16px;
          color: white;
          font-weight: bold;
          font-size: 18px;
          transition: 0.6s ease;
          border-radius: 0 3px 3px 0;
          user-select: none;
          text-decoration: none;
        }
        
        /* Position the "next button" to the right */
        .bot-next-car {
          right: 0;
          border-radius: 20px;
          background-color: ${backGroundColor};
          opacity: 0.5;
        }
        .bot-prev-car {
            left: 0;
            border-radius: 20px;
            background-color: ${backGroundColor};
            opacity: 0.5;

          }
        
        /* On hover, add a black background color with a little bit see-through */
        .bot-prev-car:hover, .bot-next-car:hover {
          background-color: ${backGroundColor};
          color: #fff;
          border-radius:20px;
          opacity: 1;
        }
        
        /* Caption text */
        .bot-text-myslides {
          color: #000000;
          font-size: 15px;
          padding: 8px 12px;
          position: absolute;
          bottom: 8px;
          width: 100%;
          text-align: center;
          cursor: pointer;
        }
        
        /* Number text (1/3 etc) */
        .bot-numbertext-myslides {
          color: #f2f2f2;
          font-size: 12px;
          padding: 8px 12px;
          position: absolute;
          top: 0;
        }
        
        /* Fading animation */
        .fade {
          -webkit-animation-name: fade;
          -webkit-animation-duration: 1.5s;
          animation-name: fade;
          animation-duration: 1s;
        }
        
        @-webkit-keyframes fade {
          from {opacity: .4}
          to {opacity: 1}
        }
        
        @keyframes fade {
          from {opacity: .4}
          to {opacity: 1}
        }
        
        #bot-chat-survey {
            padding: 22px;
            background-color: white;
            border-radius: 20px;
            color: #767676;
            display: none;
            height: 340px;
            margin: 10px;
        }

        #bot-chat-survey-1 {
            cursor: pointer;
            position: relative;            
        }
        #bot-chat-survey-2 {
            cursor: pointer;
            position: relative;            
            
        }        
        #bot-chat-survey-3 {
            cursor: pointer;      
            position: relative;            
      
        }
        .bot-survey-col{
            width:30%!important;
            flex: auto;
        }

        @media only screen and (max-width: 672px) {
            .bot-chat-open {
                right:8px;
                bottom:28px;
            }
            .bot-chat-box {
                right:5px;
                bottom:92px;
                height:60%;
                width:98%;
            }
            .bot-chat-logs {
                height:100%;
            }
            .bot-chat-btn {
                width:210px;    
            }
            .bot-survey-col{
                width:30%!important;
            }
        }
    `;
document.head.appendChild(style);
// haz clic aquí y crea una receta

var init = `
        <div class="bot-chat-open">
            <div class="bot-chat-bubble-msg">
            </div>
            <div id="bot-chat-circle" class="btn btn-raised">
                <img id="chat-circle-img" src="${iconPath}" alt="UDP's Chat Icon">
            </div>
        </div>
        <div class="bot-chat-box">
            <div class="bot-chat-box-header">
                <div class="bot-chat-box-avatar"> </div>
                <span class="bot-chat-box-sub">
                    <h5 class="bot-header-title">${title}</h5>
                </span>
                <img id="expand-btn" src="./arrows_out.png" alt="Expand Arrows" width="25.43" height="25.17">
            </div>
            <div class="bot-chat-box-body">
                <div class="bot-chat-box-overlay">   
            </div>
            
            <div class="bot-chat-logs">
            </div><!--chat-log -->
            
            <div id="bot-chat-survey" state="0" selection="0">                        
                <div class="row">
                    <div>
                        <center>
                            <p>We want to know your opinion about the service we have provided. </p>
                            <p>How was your experience?</p>
                        </center>
                        <div class="row">
                            <div class="col-6 col-md-4 text-center bot-survey-col">
                                <span id="bot-chat-survey-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="48px" height="48px" viewBox="0 0 48 48" version="1.1">
                                        <title>:)</title>
                                        <defs>
                                            <polygon id="path-1" points="2.8e-05 0.16492 41.83508 0.16492 41.83508 42 2.8e-05 42"/>
                                        </defs>
                                        <g id="bot-CHAT-S1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                                            <g id="bot-CHAT-09" transform="translate(-904.000000, -424.000000)">
                                                <g id="Group-2" transform="translate(776.000000, 208.000000)">
                                                    <g id="icon-/-48-/-cara-feliz" transform="translate(128.000000, 216.000000)">
                                                        <g id="Group-11" transform="translate(3.000000, 3.000000)">
                                                            <g id="Group-3">
                                                                <mask id="mask-2" fill="white">
                                                                    <use xlink:href="#path-1"/>
                                                                </mask>
                                                                <g id="Clip-2"/>
                                                                <path d="M20.917428,42.000112 C9.365468,42.000112 2.8e-05,32.634672 2.8e-05,21.082432 C2.8e-05,9.529912 9.365468,0.164752 20.917428,0.164752 C32.469948,0.164752 41.835108,9.529912 41.835108,21.082432 C41.835108,32.634672 32.469948,42.000112 20.917428,42.000112 Z" id="Fill-1" fill="#5EEDC7" mask="url(#mask-2)"/>
                                                            </g>
                                                            <path d="M8.50632911,27.8376314 L10.5197089,26.5822785 C12.8148388,30.1123934 16.7327595,32.2194461 21.0004197,32.2194461 C25.2680798,32.2194461 29.1851612,30.1129414 31.4802911,26.5836487 L33.4936709,27.8392756 C30.7581491,32.0462562 26.087869,34.556962 21.0004197,34.556962 C15.912131,34.556962 11.2418509,32.0457081 8.50632911,27.8376314 Z" id="Fill-4" fill="#00A7A8"/>
                                                            <g id="Group-10" transform="translate(10.101266, 12.759494)" fill="#00A7A8">
                                                                <path d="M3.21223913,5.81270633 C1.58224143,5.81270633 0.259672957,4.5122 0.259672957,2.90759241 C0.259672957,1.30270633 1.58224143,0.0022 3.21223913,0.0022 C4.84308608,0.0022 6.16593763,1.30270633 6.16593763,2.90759241 C6.16593763,4.5122 4.84308608,5.81270633 3.21223913,5.81270633 Z" id="Fill-6"/>
                                                                <path d="M18.700586,5.81270633 C17.0700221,5.81270633 15.7471705,4.5122 15.7471705,2.90759241 C15.7471705,1.30270633 17.0700221,0.0022 18.700586,0.0022 C20.3311498,0.0022 21.6534352,1.30270633 21.6534352,2.90759241 C21.6534352,4.5122 20.3311498,5.81270633 18.700586,5.81270633 Z" id="Fill-8"/>
                                                            </g>
                                                        </g>
                                                        <rect id="Rectangle" fill="#D8D8D8" opacity="0" x="0" y="0" width="48" height="48"/>
                                                    </g>
                                                </g>
                                            </g>
                                        </g>
                                    </svg>
                                </span>
                            </div>
                            <div class="col-6 col-md-4 text-center bot-survey-col">
                                <span id="bot-chat-survey-2">

                                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="48px" height="48px" viewBox="0 0 48 48" version="1.1">
                                        <title>:|</title>
                                        <defs>
                                            <polygon id="path-1" points="2.8e-05 0.16492 41.83508 0.16492 41.83508 42 2.8e-05 42"/>
                                        </defs>
                                        <g id="bot-CHAT-S2" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                                            <g id="bot-CHAT-09" transform="translate(-976.000000, -424.000000)">
                                                <g id="Group-2" transform="translate(776.000000, 208.000000)">
                                                    <g id="icon-/-48-/-cara-intermedio" transform="translate(200.000000, 216.000000)">
                                                        <g id="Group-11" transform="translate(3.000000, 3.000000)">
                                                            <g id="Group-3">
                                                                <mask id="mask-2" fill="white">
                                                                    <use xlink:href="#path-1"/>
                                                                </mask>
                                                                <g id="Clip-2"/>
                                                                <path d="M41.835108,21.082432 C41.835108,32.634672 32.469948,42.000112 20.917428,42.000112 C9.365468,42.000112 2.8e-05,32.634672 2.8e-05,21.082432 C2.8e-05,9.529912 9.365468,0.164752 20.917428,0.164752 C32.469948,0.164752 41.835108,9.529912 41.835108,21.082432" id="Fill-1" fill="#FFC058" mask="url(#mask-2)"/>
                                                            </g>
                                                            <rect id="Rectangle" fill="#B7782C" x="9.54545455" y="27.6818182" width="23.8636364" height="1.90909091" rx="0.954545455"/>
                                                            <path d="M13.3135049,18.5722 C11.6835072,18.5722 10.3609388,17.2716937 10.3609388,15.6670861 C10.3609388,14.0622 11.6835072,12.7616937 13.3135049,12.7616937 C14.9443519,12.7616937 16.2672035,14.0622 16.2672035,15.6670861 C16.2672035,17.2716937 14.9443519,18.5722 13.3135049,18.5722 Z" id="Fill-6" fill="#B7782C"/>
                                                            <path d="M28.8018518,18.5722 C27.1712879,18.5722 25.8484364,17.2716937 25.8484364,15.6670861 C25.8484364,14.0622 27.1712879,12.7616937 28.8018518,12.7616937 C30.4324157,12.7616937 31.754701,14.0622 31.754701,15.6670861 C31.754701,17.2716937 30.4324157,18.5722 28.8018518,18.5722 Z" id="Fill-8" fill="#B7782C"/>
                                                        </g>
                                                        <rect id="Rectangle" fill="#D8D8D8" opacity="0" x="0" y="0" width="48" height="48"/>
                                                    </g>
                                                </g>
                                            </g>
                                        </g>
                                    </svg>
                                </span>
                            </div>
                            <div class="col-6 col-md-4 text-center bot-survey-col">
                                <span id="bot-chat-survey-3">

                                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="48px" height="48px" viewBox="0 0 48 48" version="1.1">
                                        <title>=(</title>
                                        <g id="bot-CHAT-S3" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                                            <g id="bot-CHAT-09" transform="translate(-1048.000000, -424.000000)">
                                                <g id="Group-2" transform="translate(776.000000, 208.000000)">
                                                    <g id="icon-/-48-/-cara-insatisfecho" transform="translate(272.000000, 216.000000)">
                                                        <g id="Group-11" transform="translate(3.000000, 3.000000)">
                                                            <g id="Group-3" transform="translate(0.000000, 0.112249)" fill="#A6469D">
                                                                <path d="M41.999916,21.1616384 C41.999916,32.7594966 32.5977742,42.1616384 20.999916,42.1616384 C9.40290107,42.1616384 -8.4e-05,32.7594966 -8.4e-05,21.1616384 C-8.4e-05,9.56349905 9.40290107,0.1616384 20.999916,0.1616384 C32.5977742,0.1616384 41.999916,9.56349905 41.999916,21.1616384" id="Fill-1"/>
                                                            </g>
                                                            <path d="M20.916196,25.949616 C26.008276,25.949616 30.682316,28.4593369 33.419876,32.6626471 L31.404996,33.9176444 C29.108436,30.3905653 25.187596,28.285488 20.916196,28.285488 C16.645916,28.285488 12.725636,30.3902916 10.428796,33.9160018 L8.413916,32.6618258 C11.151476,28.4587893 15.825516,25.949616 20.916196,25.949616" id="Fill-4" fill="#55125C"/>
                                                            <g id="Group-10" transform="translate(10.080000, 12.432249)" fill="#55125C">
                                                                <path d="M6.098344,2.85889707 C6.098344,4.4366784 4.790464,5.71494684 3.177384,5.71494684 C1.564584,5.71494684 0.256704,4.4366784 0.256704,2.85889707 C0.256704,1.28084196 1.564584,0.00284728889 3.177384,0.00284728889 C4.790464,0.00284728889 6.098344,1.28084196 6.098344,2.85889707" id="Fill-6"/>
                                                                <path d="M21.417816,2.85889707 C21.417816,4.4366784 20.109936,5.71494684 18.496856,5.71494684 C16.883776,5.71494684 15.575896,4.4366784 15.575896,2.85889707 C15.575896,1.28084196 16.883776,0.00284728889 18.496856,0.00284728889 C20.109936,0.00284728889 21.417816,1.28084196 21.417816,2.85889707" id="Fill-8"/>
                                                            </g>
                                                        </g>
                                                        <g>
                                                            <g id="Group-11" transform="translate(3.000000, 3.000000)">
                                                                <g id="Group-3" transform="translate(0.000000, 0.112249)" fill="#F2608D">
                                                                    <path d="M41.999916,21.1616384 C41.999916,32.7594966 32.5977742,42.1616384 20.999916,42.1616384 C9.40290107,42.1616384 -8.4e-05,32.7594966 -8.4e-05,21.1616384 C-8.4e-05,9.56349905 9.40290107,0.1616384 20.999916,0.1616384 C32.5977742,0.1616384 41.999916,9.56349905 41.999916,21.1616384" id="Fill-1"/>
                                                                </g>
                                                                <path d="M20.916196,25.949616 C26.008276,25.949616 30.682316,28.4593369 33.419876,32.6626471 L31.404996,33.9176444 C29.108436,30.3905653 25.187596,28.285488 20.916196,28.285488 C16.645916,28.285488 12.725636,30.3902916 10.428796,33.9160018 L8.413916,32.6618258 C11.151476,28.4587893 15.825516,25.949616 20.916196,25.949616" id="Fill-4" fill="#B7006F"/>
                                                                <g id="Group-10" transform="translate(10.080000, 12.432249)" fill="#B7006F">
                                                                    <path d="M6.098344,2.85889707 C6.098344,4.4366784 4.790464,5.71494684 3.177384,5.71494684 C1.564584,5.71494684 0.256704,4.4366784 0.256704,2.85889707 C0.256704,1.28084196 1.564584,0.00284728889 3.177384,0.00284728889 C4.790464,0.00284728889 6.098344,1.28084196 6.098344,2.85889707" id="Fill-6"/>
                                                                    <path d="M21.417816,2.85889707 C21.417816,4.4366784 20.109936,5.71494684 18.496856,5.71494684 C16.883776,5.71494684 15.575896,4.4366784 15.575896,2.85889707 C15.575896,1.28084196 16.883776,0.00284728889 18.496856,0.00284728889 C20.109936,0.00284728889 21.417816,1.28084196 21.417816,2.85889707" id="Fill-8"/>
                                                                </g>
                                                            </g>
                                                            <rect id="Rectangle" fill="#D8D8D8" opacity="0" x="0" y="0" width="48" height="48"/>
                                                        </g>
                                                    </g>
                                                </g>
                                            </g>
                                        </g>
                                    </svg>
                                </span>
                            </div>
                        </div>
                        <br>
                        <textarea name="comments" style="width:100%;" id="bot-chat-comment" placeholder="Escribe tu comentario" ></textarea>
                        <center><span class="button"><a id="bot-chat-survey-send" href="javascript:;" class="btn btn-primary bot-chat-btn-snd">Send</a></span></center>
                    </div>
                </div>
            </div><!-- survey -->

        </div>
        <div class="bot-chat-input">      
            <form>
                <input type="text" id="bot-chat-input" placeholder="Ingresa tus consultas aquí..."/>
                <button type="submit" class="bot-chat-submit" id="bot-chat-submit">
                    <img src="./send.png" alt="Send Button" width="16" height="16">
                </button>
            </form>      
        </div>
    `;
document.body.appendChild(stringToHTML(init));

function bot_response(txt) {
  var pre = `
        <div id="typing"><img width="100" alt="" src="data:image/gif;base64,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06pdy7at27dw/+PKnUu3rt27ePPq3cu3r9+/gAMLHky4sOHDiBMrXsy4sePHkCNLnky5suXLmDNr3sy5s+fPoEOLHk26tOnTqFOrXs26tevXsGPLnk27tu3buHPr3s27t+/fwIMLH068uPHjyJMrX868ufPn0KNLn069uvXr2LNr3869u/fv4MOLH0++vPnz6NOrX8++vfv38OPLn0+/vv37+PPr38+/v///AAYo4IAEFmjggQgmqOCCDDbo4IMQRijhhBRWaOGFGGao4YYcdujhhyCGKOKIJJZo4okopqjiiiy26OKLMMYo44w01mjjjTjmqOOOPPbo449ABinkkEQWaeSRSCap5P+STDbp5JNQRinllFRWaeWVWGap5ZZcdunll2CGKeaYZJZp5plopqnmmmy26eabcMYp55x01mnnnXjmqeeefPbp55+ABirooIQWauihiCaq6KKMNuroo5BGKumklFZq6aWYZqrpppx26umnoIYq6qiklmrqqaimquqqrLbq6quwxirrrLTWauutuOaq66689urrr8AGK+ywxBZr7LHIJqvsssw26+yz0EYr7bTUVmvttdhmq+223Hbr7bfghivuuOSWa+656Kar7rrstuvuu/DGK++89NZr77345qvvvvz26++/AAcs8MCN2QDDACqwQEINJgABABAm1EACCyoMAIP/Dfd8AEEABYwggAERbGDEBhEYIMAIBQQAwQcZb9zxxyGPXPLJKa9sj8YcewyyyCSbjLLKLN/sss4x90wz0GLNQEMQKegAwNNQRy310zqkEAQNM7zDgQYUVICBEWCHLfbYYGNQAQUacKA1116T7bbYZqOtdjtbd/3122/HnfbaduOd99l7b1XAEC1MbfjhUbcwRAHrMJDAAX5HLvYBCTDQ+OOSZ0655ek4DnnmkW9++eeg4y26VTcIgQLirLcOAApC3FDOBCFkUPrtGYQwwey131567ruPQ7vtvmcOPO/EFx/58VG9IMMKrkfP+goyvBAOCB0soPztC3QAwvXZb196//fff4O99uJnTj746Kcf+fpOEXCC9PSzfgIB33hAgPu3E+BB/vvjH+j85w39CXCA/ytgAA8YOQIuJQc+qJ8EWeeDHGxDBA5g4O0cIIILZlCDoOOgNjAIwhB2cIQfLGHkRIiUAcRggjA8XAwGkI0ASECFoJNAAGp4QxxKTofYsKEPf7jDIPZwiHgDYlFw0IMYOvFwPcBBNRqAACSCDgENmGIVrSg5LFKDilzsYha/uMUw4s2LQtkBEZ7IxqkRYQfTuIACzCg5BVwgjnOko9/sKA056nGPd+xjHv/oNj4CxQUkaKMio0YCF0TDAgIgpN8EYIFHRlKSb6MkNCCJyUxWcv+Tl+zk2DTpkx/wYJGofBoPfvCMBwxAlG8bwANa+UpYkk2WznClLW85y1zWcpdhwyVPflCEVBqzCKxkxgNKAEyylaCXy1hmM8f2TGUyc5phq6Y1sZlNaOLEBac0pjF54EhlWOCX3DTCAD6ZjHOmM5jsPIY736nOeMoTndxcZ052kEhxipMEcETGBUJJTwEE8hgDpWfYDCpQgr6ToQ1VKNggWhMcrNGf/iSCFI3RgEFKVAFjLEZHJRo2kHLUowo16UlJCjaV0qSJGMVoD45RRpYigKYsDdtNi1FTku6UpzkF209lMoCYGpWGxAhAUMNWxGEodalGaGownrpUqU4VqlH/nUkOXmhUjMbAgsIQwRGDKoETBkOsWC1rWMeaU7WuNa1mfUkEuxpTHwwjhVB1wF2xCja9BgOvS/XrX/lqBMG6hAB07Sr+gOEBwoItgb9orGMh2wvJEpaylXWsETCrkhfML7ExPYH1fAGCBfKVAOXrRWk1i1rSmharrXUta1O7EhmAtqsy+EUHNAu2DuiWt0bwbS92y1vhDhe4xlXJDaB325iuQHa8mED7HLuA4O1CusCtbnSnS1jtbje71k2JEJrbVSH0IgTABVsIzpteI6x3F+hN73vh2975pmR15I0pCnqRPN5mgL/t/e8u+qtZAQ84wCspQH67yjhdMKC9YONc/y4eDGEJ34LC7bXwhSFsBA2XZAgLNuoQdpEADieAxCbWRYkhfGIVpxglMyhciDHagqzhggOkS+8B5nYLHHN4xzfOMXCBHOQf87gkNJixUWmQCw1wGGwaaPKTjRDlWzj5yVW28pSzXJIgKDmmQcgFBaZMATGTGRdjfnKZ0Xzmk6TgyxhNQS4qMOUKzLnOuKDzk+2cZzybxAZOg7M4dYAxW3zgbhzGQNBqcegpK9rQiIbwoyHt6EWPBAaCxigMbgGBKYMNApz2tBFAXYtOe5rUpRY1qkdS1EyLE6m1oOqTrSoLWXOY1rCwNYRxnWtR89ojKnC1OFVwiwKIusG1MLankf89C2VPmdnNPrZJWCBsY7LgFiMQ9QiwrW1bZNvT2/Z2t0vSz2ovkgS3cCiEBZBuUbO7Fupu77vh7W6T1MDcqKzBLQwgagPsu9+24Len/R1wgJfEBPhepAluEQFRR4DhDrdFwz39cIlHvCQOS3gbgXALkXl6Ax0XNchr4fEpj5zkIjeJxhd5C1GDreUut4XLjQBzUZsk4yt3IsdtUfInn5wWPefwz2URdAgPnegpP3jOn7hwi1Mc4k+vxcSnXHGpX5wk9156DPVd8IH/2+u1EPiUCR52g5Ok3FqXILptEe/0zpsWbQfu22URd97One71Lgm10z7Ba4sb3NwGfC2+PeX/cA9+3CQJNt8lSGxbOPvJ0JbF4zkceVhMHsKVt7y0S9LqxdMP1rTQdXt/7QrRp5f0rDA9cFGfel+bBNOep9+mbWHqKa96FrV/8u1jkXsO7573qv5zoGPfOkLfotFPnjSjI91e5c8C+Ym29POZn17nj+TNxG+dnPu85zt3/xZ65jCfwe9nk3g5+6wLM5vVbGb23yLNHF7z+9tskiSjH3FMxsWVOczlWuwfwv03C//XXgEogFsGYzJ2f1JTY7ngYxBGZD0mZLwFgbXggO1FgRUogZqFgSQBYgooNSPmYiyGYiOYCyvWXi1mgi+GEgr2gVGTebOAYenlYbUgg8BFgzHI/2E4mIMVthL45YL7xQsE5lgGpgtDSFhFiAtHyFdJqIQIthLj5YIAYF68EF/AZV+5YIW8hYW3oIWaxYVdWF8ssVwu+Fy9gF285V3XxV18pYa5gIaa5YZvyIZYJYcoYVsfmFu+QFyalVy7wIeO5Ye5AIiEJYiDiFwu4VkKKFq/sFqOFVuq9VpQBYm74IiERYmVKIlLhYkqgVj3t1iRpVmctQuWxVejmAuliFWniIqiGBNzRXx2JQyAFVSG9QuzmFO12Au3yFK5qIuE1YsrsVXE91XDgFZQ5VZnxVYshYy/YIxLxYzNqIwkBY0u0XmLB3pXBVWslwuqR0/beAvd+E7fCP+OWDWOJgFTfDdTxtBTEjVUw8COCuWOwQCP9CSP87hU9vgSFsV3GnUMI8VSLkUM/0hSASkMA/lRISWQKEVPBSkT/KR1AJUMCSVRFGUME6lQFUkMF1lQB2WRdQdMGUkT4JRz5LQM8/RO+mRO+IRNKYkMJ5lOLemSKzlNMXkTxKRxyNQM0pRO2hRN18RNPZkMOwmU3iSUP4lNQZkTpoRvq0RL+VSUyqBLLAmVyCCVNEmVVTmTsCRMPYFI1dZIljRNpPQMnNRMY9kMZQmS9sQMablLZ9kTauRqb4RHwGRI0eBHu2SXz4CXtqSXe7mQmOSXPsFEghZFWmRLaDQNYARLiRn/DYspSo3pmPSoR5EZFC40YzPEQ5ikRNcgRJLEmdXgmYQEmqEpjWFEmkQBQQtWQR5ESCyUDST0R695DbGpR7NJm7uIRLd5FPJzW/cDQGbkQN1gQGEknNtAnFxknMepiTiknErhPMzlXNXDPkgEP+YTPkNknd1wPtXpPdSZnd4ZFanzg6kEO9AlPL1TQsyDnkvoPusZDsOjQu8Jn+kJQvMpFYOTgE+kODAoDp4jQKfTOZjDPwF6Dv9JoJUzOgCaoFuhNEwzfNJTNVdjY3TDNtQXOXpzZOtQN21zOxnqDhx6oX7zoSBqob5DomBhMAijMAzjMBAjMRRjMYVWDzjzMjsj/zM+UzPSJw81SjQ8MzM/YzM0OjQw86M5ijRCkzNFiqNHI6QE86RQGqVSOqVUWqVWeqVYmqVauqVc2qVe+qVgGqZiOqZkWqZmeqZomqZquqZs2qZu+qZwGqdyOqd0Wqd2eqd4mqd6uqd82qd++qeAGqiCOqiEWqiGeqiImqiKuqiM2qiO+qiQGqmSOqmUWqmWeqmYmqmauqmc2qme+qmgGqqiOqqkWqqmeqqomqqquqqs2qqu+qqwGquyOqu0Wqu2equ4mqu6uqu82qu++qvAGqzCOqzEWqzGeqzImqzKuqzM2qzO+qzQGq3SOq3UWq3Weq3Ymq3auq3c2q3e+q3gGrSu4jqu5Fqu5nqu6Jqu6rqu7Nqu7vqu8Bqv8jqv9Fqv9nqv+Jqv+rqv/Nqv/vqvABuwAjuwBFuwBnuwCJuwCruwDNuwDvuwEBuxEjuxFFuxFnuxGJuxGruxHNuxHvuxIBuyIjuyJFuyJnuyKJuyKruyLNuyLvuyMBuzMjuzNFuzNnuzOJuzOruzPNuzPvuzQBu0Qju0RFu0Rnu0SJu0Sru0TNu0Tvu0UBu1Uju1VFu1VjuzgQAAIfkEBRQARwAsUwADAd0AUwAAB/+AR4KDhIWGh4QfEAEFIwIGERtGGxEGAiMFARAfiJ2en6ChoqOknzYwAyosJDUmQABAJjUkLCoDMDaluruGHBoUFRhGw8TFxsMYFRQaHLzOz9DRRzM0QSk6ANna29zZOilBNDPS5IMMCQfH6uvFBwkM5fHy0AVDLd34+dstQwXzuxNCZGBHsKCRDCEm/FvIsNANISj0SZwIAIWQGw09geiwwKBHggs6gMhIktwLGSsoqpS4QsaLkoQ8EPhIkyABDzBz6iJwYqVPiScIwBThoKZRgg5E6FzqKYePn1Al+siRMYCEo1jXSQjAtCuhATGiis0XY8DCBgiyql2HoIHXpTj/eoydm68HDnkXFKzde0zBhbcwdxChS7gbkR3lLAjgy7iYAAuAM7ogUbjyNhIupD0Y0LjzsAEPIi/8wcOy6Ww8fkB7UMKz6xKhRcf7UeS07SKqeVng7Nr1AMiypbkobds2j8y6Lizu3VvA3+DPdlAuXpwEYlIN9DJnrsAt9F04BlOnTuTuqLTbtyP4vkvu+PE9RgVIT58r+1ED3us3C0rEVfrbSaDUfaDkEJZ+48VA1SdFAZieAwSC8hSC7/nwiQcOAohThIgQQCGCQiECwkwZpkfASBwW8kJPH753wkuHdFAigB2kWIgMLSIowyETdDRjegsoZOMRN6SU43srYFRI/wg/AhjCkEcIcSSCQhgyUJPpZQBlRFO+h0IhDGAJIDwpFtAlgv4MkoCY9CVg4xBn6jfEIBykw+Z2BzQT4Qz3xDleC+McocGd9GnAIQ1+6keDIBQQmh4FHAaR6HtBCFKBo9tVwGEKk46XwhEfCINpbxhwcp8N2HRanA42QDDqdhAQCIOq48Ew36u92cdefrQWN0ABuPaWJnsq9FqcCiME69oIBLJgrG0sLKdsYwIQON2zlpFgwLSdGUBgDdiaVkME3DYWAYEmhGuZCZKUy9cGBL6ibmFAuNsYgfNa1q69asF7n7z5zgUEufyqde596QY8lwnbFpyVt/eBq/BYNUjrsP9R1d537cRQkZDsxUcxe5+zHEfFArAgGzXsd8WWDJUKt6ZMk67f8eqyTwO4KjNNsd43680+wRDqzh6VSiCqQKvE6hGXEl2QphFymvREnx7RqNMEQRqhpFNLVKmgWBNkaISIdq3PokfUGbY6eXLIp9n4AKrm2se4mSKccHMzpzl0G0Mmh2bmvc3KR1zZt5ZDcin4l0v2PcyTQ0opOABVFtJj30FCWaTgScbYd41QHoFj3jseMuLaJ4Z+xIpwv9gJhmFvqLqHZofYSYNEQ6j6IBMmbeEn/hEt4O6DGJi0gqHEnDLNxNvsMn+hoAfyesQX4l7J8Y2SHcjdVV9IeCWXV4rkcg47570h0k1s3S678fvb+YcMF/BxzrDmLmzwI0LbvLitxpuyoMlfJ0gTrtRIQzHKeowAPTGZZ2GmHHnBlV8W+AnB9Oow8kDLqNpCQVDERVV2WYhV7rSVDuLnQGcqS0aIIqakmJAUTjnTVGAikxnd5IW74EmOgrKUjfgISCLBIS9OYiQkucQrATGcZxAiJCE64yGKO41FlBSZc9hpL+74mxOlUY8+EYYfhJONL4AhKpokYxl62qI8qGGNVPnkG+EIVIoUwQhHQEISlLAEJjRhKjWS5BSpWEUrXhGLWdTiFrn4RyAAACH5BAkUAEcALN0AAwFmAVMAAAf/gEeCg4SFhoeEHxABBSMCBhEbRhsRBgIjBQEQH4idnp+goaKjpJ82MAMqLCQ1JkAAQCY1JCwqAzA2pbq7vL2+v8DBiBwaFBUYRsnKy8zJGBUUGhzC1NXWRzM0QSk6AN7f4OHeOilBNDPX6err7OkMCQfN8vPLBwkM7fn5BUMt4v8AwbUYUkCfwYMI1U0IkYGew4dGMoSYkLCirhtCUATcyBEACiE3LIocSXIQiA4LIKp0uKADiJIwBb2QsaKjzY0rZLyIybNnNQ8EVgp1SMCDT4sETtxcuvEEgaNQo4YS4WCoVYcOREhtl8MH068bfeTYSnZrAAlX086TEKDstQEx/8DKBRhjgNu7MBsgUMt3HoIGeH/h6DG3MMAeOAIrPnhBQd/HzRRcWKxrBxHDmMUR2UG5czoLAiCLXibAgudQLkhkXg2OhIvTsH89GDC6drIBD2Ij+sGDtW9vPH7oHj7qQQnbyEvkJi7oR5Hf0IsIZ07dkAXayJEPME3cRW/o0Hm8rk7+Qujs2QVM1r1DNXjwJDiTZ97AMXr0CgDDxnH5/Xsiic033F733YdAbIT5518PAuoWQIEQtuXZAApWaFeDnomAFoT3SaAVZTnEVaF/MYyFIWVVcVigA515NaKCPpy4mAcqcmiUYgS8OOJTMt4FQlA1FkjAS3i9oJSOCp6wU/+PZXUQJIcdBCYDkiPKwCRZE6T0ZIELUOTWDTVRqeAKIV0ZVQhbchjCXUKIOaIQZkbVUJoFZnCXRm4qiEKcRzFAJ4f4kFVAniMWxCdPCfwJYQJlDUFohUMcGhMH8Sh63wHTSDWDP4/61wI6kpKkgaUQarAVDZ1WSEOoJFFAaoEUbBVEqgoGwepIFbx6XwVbpUCrfyncatEHyOiaHQacQGVDN7+Cp0MuwiIEgbH3QRAVDM36B0O0CD1IbXYSHkVhtuBdyK0+BXybnaFHqUAueCqca9AI6iI3QlQsvAsdC/Lqc169owkQlXv6skZCv/kYAHBtBkRVQ8G+1YBwOxEsPFr/BFGZADFrJkzMjiQWQ7ZBVK9snBkQHq8T8mhRmcxayuqAvDJfI0NVssuFoQzzNRXPzBfGUGmMc2Ed72yNwj6r1TBUDw89l8RGV/Nv0lYJDBXBTn91cNTU0Ev1VfdClW/WYPHLtTDpfm0Vuz65S/ZX8Z4djLdqCxWuT+O+vZS5cvsybd1CWQsVtnovtW3fvxALuErIRrVs4TY9izgwuS7+EK9S+Qo5R8FO/ourljsUq1Szbr6RrZ77Mmro9JgqFaqmB7Rq6r1Qyro8mG61aez/fEq7L4nezgyjZDnKeziR/t6Ln8IvE+hWgx4PDtvK6zJn83a6haf0e1bfC5rNG7Gm/1ttSg8AnN7zkmXzXd4FpvRkpt+Lk8JHideUx1spPy8/3j5kYEbinZL21wsase5GgclR7HhEQF6kaHEsooyLIBejBvZCQ4vzUGdCBLkSWdAXdFPb3RaTt7fx7YO7INDXDgSbBJGNQSj0RX2+lp/Y8IdsAIrhL8yTNPUMpz1Oi48OgXGdmW2HOd7BmXiGGAzjhEw51XGOyaTDRGHMZmG4mQ9vIBacKlIDNPUqTYNSoy/XeLEajfmWZE5kGXJt5ozW0Iux/tKjwTQLMXBMx1ksxZY4waVTdcnjOqjyp6wcqiuEEosg2wGUJxXlVkmhklMWqY+TaIlLLonWTMI0Jp1Q8l4gC7mebSTipXNhZHu/+UiZPpmQd1TqMfZ4nsf4wSnMDIR6rKwIMYxRLKE8IxqZilo2tsGspZDDHKDKJU8UwQhHQEISlLAEJjSRrNSdIhWraMUrYjGLWtwCWsrsRSAAACH5BAkUAEcALAAAAAAgA1gCAAf/gEeCg4SFhoeIiYqLjI2Oj5CRkpOUlZaXmJmam5ydnp+goaKjpKWmp6ipqqusra6vsLGys7S1tre4ubq7vL2+v8DBwsPExcbHyMnKy8zNzs/Q0dLT1NXW19jZ2tvc3d7f4OHi4+Tl5ufo6err7O3u7/Dx8vP09fb3+Pn6+/z9/v8AAwocSLCgwYMIEypcyLChw4cQI0qcSLGixYsYM2rcyLGjx48gQ4ocSbKkyZMoU6pcybKly5cwY8qcSbOmzZs4c+rcybOnz59AgwodSrSo0aNIkypdyrSp06dQo0qdSrWq1atYs2rdyrWr169gw4odS7as2bNo06pdy7at27dw/+PKnUu3rt27ePPq3cu3r9+/gAMLHky4sOHDiBMrXsy4sePHkCNLnky5suXLmDNr3sy5s+fPoEOLHk26tOnTqFOrXs26tevXsGPLnk27tu3buHPr3s27t+/fwIMLH068uPHjyJMrX868ufPn0KNLn069uvXr2LNr3869u/fv4MOLH0++vPnz6NOrX8++vfv38OPLn0+/vv37+PPr38+/v///AAYo4IAEFmjggQgmqOCCDDbo4IMQRijhhBRWaOGFGGao4YYcdujhhyCGKOKIJJZo4okopqjiiiy26OKLMMYo44w01mjjjTjmqOOOPPbo449ABinkkEQWaeSRSCap5P+STDbp5JNQRinllFRWaeWVWGap5ZZcdunll2CGKeaYZJZp5plopqnmmmy26eabcMYp55x01mnnnXjmqeeefPbp55+ABirooIQWauihiCaq6KKMNuroo5BGKumklFZq6aWYZqrpppx26umnoIYq6qiklmrqqaimquqqrLbq6quwxirrrLTWauutuOaq66689urrr8AGK+ywxBZr7LHIJqvsssw26+yz0EYr7bTUVmvttdhmq+223Hbr7bfghivuuOSWa+656Kar7rrstuvuu/DGK++89NZr77345qvvvvz26++/AAcs8MAXfgBBAAWMIIABEWxgxAYRGCDACAUEAMH/B/cYjLDCDDsMscQUW4zxOjbAMIAKLJBQgwlAAACECTWQwIIKA8BgA6AcaEBBBRgY4fPPQAftMwYVUKABB+/kvHPPQjf9M9FGIz3ODDQEkYIOAGSt9dZcZ61DCkHQMIOeDCRwgNNoO31AAgysU/bZacf989ptf1PAEC10rffeW7cwRAF1ThBCBnIXLnQGIUxQjuCEG+64EYgrns0NQqDA9+WYA4CCEDfACUIHCzwuus8LdABCOJ+HPvrjpZ9ezQsyrJD57JevIMMLbXpAwOq8E+DBN7rzvrrv1BBwAu3IX34C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WI3WeI3YmI3auI3c2I3e+I3gGI7iOHmO5FiO5niO6JiO6riO7NiO7viO8BiP8jiP9FiP9niP+JiP+riP/NiP/viPABmQAjmQBFmQBnmQCJmQCrmQDNmQDvmQEBmREjmRFFmRFnmRGJmRGrmRHNmRHvmRIBmSIjmSJFmSJnmSKJmSKrmSLNmSLvmSMBmT8BAIACH5BAUUAEcALAAAAAAgA1gCAAf/gEeCg4SFhoeIiYqLjI2Oj5CRkpOUlZaXmJmam5ydnp+goaKjpKWmp6ipqqusra6vsLGys7S1tre4ubq7vL2+v8DBwsPExcbHyMnKy8zNzs/Q0dLT1NXW19jZ2tvc3d7f4OHi4+Tl5ufo6err7O3u7/Dx8vP09fb3+Pn6+/z9/v8AAwocSLCgwYMIEypcyLChw4cQI0qcSLGixYsYM2rcyLGjx48gQ4ocSbKkyZMoU6pcybKly5cwY8qcSbOmzZs4c+rcybOnz59AgwodSrSo0aNIkypdyrSp06dQo0qdSrWq1atYs2rdyrWr169gw4odS7as2bNo06pdy7at27dw/+PKnUu3rt27ePPq3cu3r9+/gAMLHky4sOHDiBMrXsy4sePHkCNLnky5suXLmDNr3sy5s+fPoEOLHk26tOnTqFOrXs26tevXsGPLnk27tu3buHPr3s27t+/fwIMLH068uPHjyJMrX868ufPn0KNLn069uvXr2LNr3869u/fv4MOLH0++vPnz6NOrX8++vfv38OPLn0+/vv37+PPr38+/v///AAYo4IAEFmjggQgmqOCCDDbo4IMQRijhhBRWaOGFGGao4YYcdujhhyCGKOKIJJZo4okopqjiiiy26OKLMMYo44w01mjjjTjmqOOOPPbo449ABinkkEQWaeSRSCap5P+STDbp5JNQRinllFRWaeWVWGap5ZZcdunll2CGKeaYZJZp5plopqnmmmy26eabcMYp55x01mnnnXjmqeeefPbp55+ABirooIQWauihiCaq6KKMNuroo5BGKumklFZq6aWYZqrpppx26umnoIYq6qiklmrqqaimquqqrLbq6quwxirrrLTWauutuOaq66689urrr8AGK+ywxBZr7LHIJqvsssw26+yz0EYr7bTUVmvttdhmq+223Hbr7bfghivuuOSWa+656Kar7rrstuvuu/DGK++89NZr77345qvvvvz26++/AAcs8MCNfQBBAAWMIIABEWxgxAYRGCDACAUEAMH/B/cYjLDCDDsMscQUW4yxPRonvHDDD0c8ccUXk3ywyR2nDDLLI9djAwwDqMACCTWYAAQAQJhQAwksqDAADDaIxYEGFFSAgRFQRy311FBjUAEFGnDwztJNP03111FbjbXW7nDtNNhoi5112UyfjfbXapPdzgw0BJGCDgDkrffefOetQwpB0DADVwwkcMDbiEt9QAIMrFP44Yknvnjj6jweueSMV2745YhPvk4BQ7TQ9+ik793CEAVcNUEIGXDuegYhTFDO6q27fjnsspNDu+23x64767xHjns5NwiBQunIJw8ACkLcIBUIHSwQvOsLdABCONBLP/3l1V8PTvbbc2/9//fRhx959+G8IMMKyreP/AoyvPCUBwSY7zoBHnxDv/2c469//fyLnP+6sb8AJm6A3SDACdzHQOSdgABMEYEDDOg6B4hgGxKkIOcsiMEJajByHMxGBj+YuBBmIwc+aKAKkeeDHCQlABIg4eUkEIBswFCGkaOhDWOIQ8Tp8Bo37OHbfniNAcRghUgkXQwGYJQGIECIl0NAA6rhRChGTopUfKIVEYfFaVRxi2/r4jRw0IMkmpF0PcDBUC6gADAmTgEXmAYb3Yg4OMqxjXREmx2jMcc8gm2P0dgBEc5IyL4RYQdBsYAA/Pg2AVggGopkJNocCclFSvJrlHxGJC9JtUw+w/8FJCikKPdGAhf85AED4CTYBvCAZ6BSlV9jpStTCcupybIZr6yl1G7ZjB/wYJTAzBsPftCTB5RAl1QrQSuZYUxkTk2ZuDymM6MGzWU0c5pQq+YyflCEYHqzCMTUiQVoiU2oDeCRyhhnOaN2zmWoc51GaGcy3rlOeSbDBb/0pjd5YEqcXMCS8DSCAOKIjH8GFGoDTYZBD5rQYyw0oA09xg5CqU99kgCRNmkAHg9qBAVM0Rga5SjUPHqMkIqUpMUwKUdRWgwcDLKiFSWCGmuiRZEaAQHHqKlIcWoMnXKUp8Tw6UGBSowywhSmPahJAGwqtRoSY6lMhZpThwHVqE41GFX/ZepVgzGAo3qViTIRAQ+jKoELCkOsUYVaWYeB1rSuNRhtJatZg5GDI3oVpjFwYUw8mFYjOGAYfE3rX4UR2KgOFhiFZephgZHCux7VBzHxQF+llj9gSHayUKvsLy6LWc32grOT9WwvCODYu0LQJSAAIGYJ4L1epBazUGPtL14LW9m6VrWTtW0vXrDA0h71BPJrSQdgG7UO/GK4xDWCcX2BXOIulxfNhe1zeSED395VBi2ZgPaIu4Dc7UK7yTVCd3sB3uSO97vbhe15d3ED9ln3qCtw3kpCEF6ohaAX9K3vfXmR3/DuVxf9Te5/dSGE995VCCypXXgz0AsFJ5fBvHAw/3EhrAsJw5bCujiegY+KgpUwoL5Ro1wuPgxiI4gYFyQG8YltkeL6rtgWBdjwXVOXkgSU2AgJ2IWNS5xjXewYxD3GxY/rG2RcDEHGXh1CSjgAORAfQG62YPKNn5wLKZeYyrewspOhXIsZiA7JMG3B4E6igRtDTQO5KLOZ0YwLNd+YzbZwc4nhbAsagNmrNEAJBcxsBArkYs9m9jMuAH1jQduC0CU2tC2CcOejBgElFeBzBXIRaTNPGheVvvGlbZHpEm/aFiloNExTcJIPeO3GGKgZLUzN51TfgtVmdnUtYI1qVc/CBngTtT51kLSSQIDPUIPALX4NbGHbgth8NjYtkP9tZmXTAga6hikMTJLVG29VFtUu8bVjkW0Qb/sV3a7vt1/R1WjrE6wkKQCwjUDjWqgb2O2mxbv5HG9ZzNvM9ZaFCsytTxWYZATrHsEtAA5sgduC4Hw2OC0QbmaF04IF/PYmC0wCUDML4BYVv/HFbZHxEm+cFh0H8cdpQdGIj5IEJjHAug1wC5UDm+W2cDmfYU4LmZuZ5rSogcmBWQOTRGDdEbjFz4EddFsMnc9Fp8XRzZx0Wphg56M0gUkcBuwN3ILqfLa6LbBuZq3Tgus39jotfgb1QgLBJOuG2i3SboS1p90WbL9F2Uc59XWLfRZgL/HdZZF3EO8dFn2v799hQfb/uZvx7CVZ+o2bPgvFl5jxsnA8iCEPC8nXl/KweLrhzSj1ktj8xjifxedLHHpZjB7EpYfF6eubeljofPNJ7HlJQl7fkc+C9uG1vSxwn1zdw4L3xPU9LEoOexWivCQMv7HDZ5H8Ei9fFs0H8fNhEf36Th8WEC/+CideknvfON+x8H6JwQ8L8YOY/K4wf33R74p9a1+F/i5JuMM7blfMP7n1b8X9iZv/Vewftv23CuX2fgyEbiPBbDfmbLOAgCWmgLLAgCDmgLAAgfUlgbAAbQTIQNNWErRWYrI2a6fmgbYmCx0IYh84CyVYXyd4a7mWgcnDayfRaSD2abUgg/VFg7Rg/4PhhYOyoIPJxYOyEGoumDykdhKIBmKKVgtHWF9JSAtLGF5NKAtPmFxRKAuMNoTI82hkxmd0VgtyBmJdSAtfWF9hKAtjGF5lKAt2hoWlk2cnoWX1hWVZ1mRxyGW0AIfhJYe1gIfJpYdd9mVsyDdiVmM3VmS3MGThZYi2gIjJpYi0wIjE5Yi0cGSByDdKlhItFl4vVguZmFybSAudSFyfKAuhCFujaG+VyDfsFxIWhlkYlgutOFmviAux2FezaAu1mFa3aAsaloodNl8gNmC5EGDEJYy4QIywZYy2gIyYpYy2UGCpCAAIthLlxV3epQvVqF7XmAvZiFnrxY3p5Y3biP8L7ZWK8SVc4TVduxBdmKWOusCOk+WOuACPfSWPuFBdlYhdLUFbq9VavMCPueWPuwCQfaVbA4lbBSmQusBbgQhcLwFafSVavACRaSWRu0CRUWWRuYCRTKWRuUBabHhaL5FYNrVYv0CSImWSvoCSHKWSvMCSB+WSvNBYLghZMRFXTPVWcDVWOTlXwICTNqWTvwCUIiWUv1BXLphXM/F/2BSAuMCU0+SUtwCVziSVtUCVyGSVtTCA72eAMSFUAUVUwwCW8CSWwkCW62SWwICW5aSWwGBU2pdUNaFSB8VSxECXAWWXw4CX8KSXwcCX6+SXweBS2idTN/FQ8BRRxoCY66T/mMXAmOXkmMMAmdgkmcMwUbB3UTlBT+VkT8jAmdjkmccAmtMkmsVAms5kmsWAT4bHTztxTdikTcoAm9Mkm8lAm85km8eAm8ikm8fATWUHTsVETsjES8xEnLpknNaEnLWknLfJnLDknMngSzs3TD+xSbrkSc6AnbWknc3AnbDkne4EfHkknssAShFXSkHRR7AESNDAnqrkns8An5wkn81An5dkn80gSOZ2SEPxRZwkRtIAoJckoNFAoJJkoM+AoIykoM9ARrqWRkYRRH5ERNZAoXlkodWAoXSkodPAoW7kodNgRGC2REkxQnRkQtiAom6kotfAomDkotUAo1sko9WA/0Iy1kJMUUBWhEDcwKNQ5KPbAKRCJKTZQKQ9ZKTZoEDW9UBPAT49hD7kE44fJKXfAKU4ZKXdgKUypKXdoD7uBV/xIxW780HD8zu5uD1nOg5lqkFrGg5tSkFvGg7F04vBxDzyVRWWYz+eozl0uD19mg57aj6Beg6DGj6Feg6gA4hndDqrGBVmE4KREzdb0zaSmjiUyjZdYzuZyg6RyqlXszbuQDd204Lu8zeBM2ZgUTIcgzIfszIikzEv06oeozIh0zIuszEnU6szE6v1wKq7KjOwiqs2gzM6wzM+AzRCQzRGgzQE86zQGq3SOq3UWq3Weq3Ymq3auq3c2q3e+q3gGv+u4jqu5Fqu5nqu6Jqu6rqu7Nqu7vqu8Bqv8jqv9Fqv9nqv+Jqv+rqv/Nqv/vqvABuwAjuwBFuwBnuwCJuwCruwDNuwDvuwEBuxEjuxFFuxFnuxGJuxGruxHNuxHvuxIBuyIjuyJFuyJnuyKJuyKruyLNuyLvuyMBuzMjuzNFuzNnuzOJuzOruzPNuzPvuzQBu0Qju0RFu0Rnu0SJu0Sru0TNu0Tvu0UBu1Uju1VFu1Vnu1WJu1Wru1XNu1Xvu1YBu2Yju2ZFu2Znu2aJu2aru2bNu2bvu2cBu3cju3dFu3dnu3eJu3eru3fNu3fvu3gBu4gju4hFu4hnu4iJu4irt1uIzbuI77uJAbuZI7uZRbuZZ7uZibuZq7uZzbuZ77uaAbuqI7uqRbuqZ7uqibuqq7uqzbuq77urAbu7I7u7Rbu7Z7u7ibu7q7u7zbu777u8AbvMI7vMRbvMZ7vMibvMq7vMzbvM77vNAbvdI7vdRbvdZbu4EAADs=" /></div>
    `;
  const chatLogs = document.querySelector('.bot-chat-logs');
  chatLogs.appendChild(stringToHTML(pre));

  console.log(txt);
  var selection = document.getElementById("bot-chat-survey").getAttribute("selection");
  var usercomments = document.getElementById("bot-chat-comment").value;

  // Define the settings object
  var settings = {
    method: "POST",
    headers: {
      "Channel": "web",
      "Content-Type": "application/json",
      "bot-session": SESSION,
    },
    body: JSON.stringify({
      "text": txt,
      "answered": 1,
      "evaluation": parseInt(selection),
      "expireSession": true,
      "userComments": usercomments,
    }),
  };

  // Perform the HTTP request using the Fetch API
  fetch("https://us-east1-mkt-003001-00813.cloudfunctions.net/asdasda-frontalESP", settings)
    .then(function (response) {
      return response.json();
    })
    .then(function (response) {
      console.log(response);
      SESSION = response.session;

      if (selection == "0") {
        response.answers.forEach(function (element) {
          console.log(element);
          if (element.type == "TEXT") {
            buttons = element.buttons;
            generate_message(element.content, 'user', buttons, 'TEXT', element.technicalText);
          } else {
            buttons = element.buttons;
            generate_message(element.content, 'user', buttons, element.type, element.technicalText);
          }
        });
      }
    })
    .catch(function (error) {
      console.error('Error:', error);
    });
}

function generate_message(msg, type, buttons, item, technicalText) {
  INDEX++;

  const chatLogs = document.querySelector('.bot-chat-logs');

  if (item == "CAROUSEL") {
    var carId = 1;
    var last = msg.length

    var stl = ""
    var car = `
            <div id="cm-msg-${INDEX}" class="bot-chat-msg user">          
                <span class="bot-msg-avatar"></span>
                <div class="bot-slideshow-container" pos="1" last="${last}">

        `;

    msg.forEach(function (item) {
      if (carId == 1) {
        stl = `style="display:contents;"`;
      }

      car += `
                <div ${stl} class="bot-mySlides fade idx${carId}" idx="${carId}">
                    <div class="bot-numbertext-myslides">
                        ${carId} / ${last}
                    </div>
                    <span class="bot-carousel-img">
                        <img src="${item.imageUrl}" style="width:60%" class="class="rounded mx-auto d-block">
                    </span>
                        <div caritem="${item.title}" class="bot-text-myslides bot-chat-car-btn">
                            ${item.title}
                        </div>
                </div>
            `;
      stl = ""
      carId++;
    });
    car += `    
                <a class="bot-prev-car" >&#10094;</a>
                <a class="bot-next-car" >&#10095;</a>
            </div>
        `;

    chatLogs.appendChild(stringToHTML(car));
  }

  if (item == "VIDEO") {
    var vid = `
            <div id="cm-msg-${INDEX}" class="bot-chat-msg user">         
                <span class="bot-msg-avatar"></span>
                <div class="bot-modal">
                    <div class="bot-modal-content">
                        <span class="bot-close-video">&times;</span>
                        <span class="bot-open-video"> [+] </span>
                        <iframe class="bot-video-frame" width="100%" src="${msg}" frameborder="0" allow="fullscreen; picture-in-picture" allowfullscreen></iframe>
                    </div>
                </div>               
            </div>
        `;
    chatLogs.appendChild(stringToHTML(vid));
  }

  if (item == "AUDIO") {
    var vid = `
            <div id="cm-msg-${INDEX}" class="bot-chat-msg user">          
                <span class="bot-msg-avatar"></span>
                <audio style="width:260px;" controls="controls">
                    <source src="${msg.replace('http:', 'https:')}" type="audio/mpeg" />
                    Your browser does not support the audio element.
                </audio>                      
            </div>
        `;
    chatLogs.appendChild(stringToHTML(vid));
  }

  if (item == "IMAGE") {
    var img = `
            <div id='cm-msg-"+INDEX+"' class="bot-chat-msg ${type}">
                <span class="bot-msg-avatar"></span>
                <div class="bot-cm-msg-text">
                    <img src="${msg}" alt="Smiley face" width="100%" style="border-radio:5px">
                </div>
            </div><br>
        `;
    chatLogs.appendChild(stringToHTML(img));
  }

  if (item == "FILE") {
    var file = `
            <div id="cm-msg-${INDEX}" class="bot-chat-msg ${type}">       
                <span class="bot-msg-avatar"></span>
                <div class="bot-cm-msg-text">
                    <a class="bot-chat-href" target="_blank" href="${msg.url}" download="${msg.filename}">
                        <?xml version="1.0" encoding="iso-8859-1"?>
                        <!-- Generator: Adobe Illustrator 18.1.1, SVG Export Plug-In . SVG Version: 6.00 Build 0)  -->
                        <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 493.894 493.894" style="enable-background:new 0 0 493.894 493.894;" xml:space="preserve">
                            <g>
                                <g id="Icons_20_">
                                    <g>
                                        <path d="M418.152,0H203.408c-12.427,0-24.325,4.953-33.101,13.755L42.654,142.01c-8.715,8.754-13.602,20.597-13.602,32.944
                                            v272.243c0,25.789,20.916,46.697,46.705,46.697h342.395c25.788,0,46.69-20.908,46.69-46.697v-400.5
                                            C464.842,20.91,443.94,0,418.152,0z M431.914,447.197c0,7.597-6.175,13.769-13.763,13.769H75.757
                                            c-7.605,0-13.781-6.172-13.781-13.769V184.238h131.322c12.088,0,21.928-9.839,21.928-21.939V32.927h202.926
                                            c7.587,0,13.763,6.172,13.763,13.77v400.5H431.914z" fill="${buttonColor}"/>
                                        <path d="M339.277,254.455H154.646c-13.632,0-24.695,11.054-24.695,24.695s11.063,24.695,24.695,24.695h184.631
                                            c13.636,0,24.695-11.054,24.695-24.695S352.912,254.455,339.277,254.455z" fill="${buttonColor}"/>
                                        <path d="M339.277,172.139h-69.388c-13.635,0-24.694,11.054-24.694,24.694c0,13.642,11.059,24.695,24.694,24.695h69.388
                                            c13.636,0,24.695-11.053,24.695-24.695C363.971,183.193,352.912,172.139,339.277,172.139z" fill="${buttonColor}"/>
                                        <path d="M339.277,89.825h-69.388c-13.635,0-24.694,11.05-24.694,24.695c0,13.641,11.059,24.694,24.694,24.694h69.388
                                            c13.636,0,24.695-11.054,24.695-24.694C363.971,100.876,352.912,89.825,339.277,89.825z" fill="${buttonColor}"/> 
                                        <path d="M339.277,347.421H154.646c-13.632,0-24.695,11.053-24.695,24.694s11.063,24.695,24.695,24.695h184.631
                                            c13.636,0,24.695-11.054,24.695-24.695S352.912,347.421,339.277,347.421z" fill="${buttonColor}"/>
                                    </g>
                                </g>
                            </g>
                        </svg>
                        ${msg.filename}
                    </a>             
                </div>       
            </div>
        `;
    chatLogs.appendChild(stringToHTML(file));
  }

  if (item == "TEXT" || item == "TEXT_OPTIONS") {
    msg = msg.replaceAll("rgb(0, 0, 0)", "")
    msg = msg.replace(/&nbsp;/gi, " ")

    var typeIcon = type == "self" ? "user-icon.png" : "./bot_salud_mental.png";

    var str = `
            <div id="cm-msg-${INDEX}" class="bot-chat-msg ${type}">
                <span class="bot-msg-avatar"><img src="${typeIcon}" class="bot-msg-avatar ${type}" height="32" width="32"></span>
                <div class="bot-cm-msg-text">${msg}</div>
            </div>
        `;

    if (buttons.join() !== "") {
      str += `
                <div class="bot-cm-msg-button">
                    <ul>
            `;

      buttons.forEach(function (button) {
        if (button.type == "URL") {
          if (technicalText?.button_type === "share_button") {
            var shareAction = "";
            if (button.action !== "") {
              shareAction = `href="${button.action}"`;
            } else {
              shareAction = ``;
            }

            str += `<li class="button">
                                    <a ${shareAction} target="_blank" class="btn btn-primary bot-recipe-btn" chat-value="${button.action}">
                                        ${button.name}
                                    </a>
                                </li>`;
          } else {
            str += `<li class="button">
                                    <a href="${button.action}" target="_blank" class="btn btn-primary bot-recipe-btn p-3">
                                        ${button.name}
                                    </a>
                                </li>`;
          }
        } else if (button.type == "FLOW") {
          if (technicalText?.button_type == "start_button") {
            str += `<li class="button">
                                    <a href="javascript:;" class="btn btn-primary bot-chat-btn" chat-value="${button.name}">
                                        ${button.name}
                                    </a>
                                </li>`;
          } else if (technicalText?.button_type == "recipe_select") {
            var nameSplit = button.name.split(" - ");
            var title = nameSplit[0];
            var time = nameSplit[1];

            str += `<li class="button">
              <a href="javascript:;" class="btn btn-primary bot-recipe-btn d-flex flex-column" chat-value="${button.name}">
                <div>${title}</div>
                <div class="bot-recipe-btn-time">
                  <img src="assets/icons/clock.png" heigh="14" width="14" class="mr-1">
                    ${time}
                </div>
              </a>
            </li>`;
          } else {
            str += `<li class="button">
                                    <a id="normal_flow" href="javascript:;" class="btn btn-primary bot-recipe-btn d-flex flex-column" chat-value="${button.name}"> 
                                        ${button.name}                                          
                                    </a>
                                </li>`;
          }
        } else {
          str += `<li class="button"><a href="javascript:;" class="btn btn-primary bot-chat-btn" chat-value="${button.name}">${button.name}</a></li>`;
        }
      });
      str += `
                    </ul>
                </div>
            `;
    }

    const typingElement = document.getElementById('typing');
    if (typingElement) {
      typingElement.parentNode.removeChild(typingElement);
    }

    chatLogs.append(stringToHTML(str));
  }

  const cmMsgElement = document.querySelector("#cm-msg-" + INDEX);
  if (cmMsgElement) {
    cmMsgElement.style.transition = 'opacity 0.3s';
    cmMsgElement.style.opacity = 0;
    setTimeout(() => {
      cmMsgElement.style.opacity = 1;
    }, 300);

    if (type === 'self') {
      const botChatInput = document.querySelector("#bot-chat-input");
      if (botChatInput) {
        botChatInput.value = '';
      }
    }

    const botChatLogs = document.querySelector(".bot-chat-logs");
    if (botChatLogs) {
      const scrollHeight = botChatLogs.scrollHeight;
      const duration = 800;
      const startTime = performance.now();
      const startTop = botChatLogs.scrollTop;

      function scroll() {
        const currentTime = performance.now();
        const elapsedTime = currentTime - startTime;
        const scrollProgress = Math.min(1, elapsedTime / duration);

        botChatLogs.scrollTop = startTop + scrollProgress * (scrollHeight - startTop);

        if (scrollProgress < 1) {
          requestAnimationFrame(scroll);
        }
      }

      requestAnimationFrame(scroll);
    }
  }
}

document.getElementById('bot-chat-submit').addEventListener('click', function (e) {
  e.preventDefault();
  var msg = document.getElementById('bot-chat-input').value.trim();
  if (msg === '') return false;

  generate_message(msg, 'self', [], 'TEXT');
  bot_response(msg);
});

function clickHandler(event) {
  event.preventDefault(); // Prevent the default click behavior
}

document.addEventListener('click', function (event) {
  const target = event.target;
  if (target.classList.contains("bot-chat-btn") && !target.disabled) {
    // TODO: CHECK IF NEED CHANGES TO SHOW BUTTON DISABLED VISUALLY
    target.disabled = true;

    // target.addEventListener("click", function(event) {
    //     event.preventDefault(); // Prevent the default click behavior
    // });

    target.addEventListener('click', clickHandler);

    if (target.getAttribute('href') === 'javascript:;') {
      var value = target.getAttribute('chat-value');
      generate_message(value, 'self', [], 'TEXT');
      bot_response(value);
    }
  }
});

document.addEventListener('click', function (event) {
  const target = event.target;
  if (target.classList.contains("bot-recipe-btn")) {
    if (target.id === 'copy-recepedia-link') return;

    if (target.getAttribute('href') === 'javascript:;') {
      target.disabled = true;

      var value = target.getAttribute('chat-value');
      generate_message(value, 'self', [], 'TEXT');
      bot_response(value);

      target.parentElement.parentElement.remove();
    }
  }
});

document.addEventListener('click', function (event) {
  const target = event.target;
  if (target.classList.contains("bot-chat-car-btn")) {
    var value = target.getAttribute('caritem');
    generate_message(value, 'self', [], 'TEXT');
    bot_response(value);
  }
});

var isChatOpen = false;

function closeChatBox() {
  const chatBoxStyle = document.querySelector('.bot-chat-box').style;
  chatBoxStyle.transform = 'scale(0)';
  setTimeout(() => {
    chatBoxStyle.display = 'none';
  }, 300);
}

function openChatBox() {
  const chatBoxStyle = document.querySelector('.bot-chat-box').style;
  chatBoxStyle.display = 'block';
  setTimeout(() => {
    chatBoxStyle.transform = 'scale(1)';
  }, 300);
}

document.addEventListener('click', function (event) {
  const target = event.target;

  const chatBoxStyle = document.querySelector('.bot-chat-box').style;
  if (target.id === "expand-btn") {
    if (window.innerWidth <= 672) {
      // chatBoxStyle.transition = 'height 0.5s, bottom 0.5s';
      chatBoxStyle.height = '85%';
      chatBoxStyle.bottom = '8px';

      document.querySelector('.bot-chat-box-body').style.height = '73%';

      target.src = './close.png';
    } else {
      // chatBoxStyle.transition = 'width 0.5s';
      chatBoxStyle.width = '659px';

      const chatInputStyle = document.querySelector('.bot-chat-input').style;
      chatInputStyle.transition = 'width 0.5s';
      chatInputStyle.width = '96%';

      target.src = './arrows_in.png';
    }

    target.id = 'reduce-btn';
  } else if (target.id === "reduce-btn") {
    if (window.innerWidth <= 672) {
      isChatOpen = false;

      // Closing Method
      const chatCircleStyle = document.querySelector('#bot-chat-circle').style;
      chatCircleStyle.transition = 'width 0.1s, height 0.1s';
      chatCircleStyle.width = '72px';
      chatCircleStyle.height = '72px';
      chatCircleStyle.background = '#fff';
      chatCircleStyle.padding = '8px';
      document.querySelector('#chat-circle-img').src = iconPath;


      chatBoxStyle.bottom = '92px';
      chatBoxStyle.height = '60%';
      document.querySelector('.bot-chat-logs').style.height = '60%';

      closeChatBox();
    } else {
      chatBoxStyle.width = '497px';

      const chatInput = document.querySelector('#bot-chat-input');
      chatInput.style.transition = 'width 0.5s';
      chatInput.style.width = '94%';
    }

    target.src = './arrows_out.png';
    target.id = 'expand-btn';
  }
});

document.querySelector(".bot-chat-bubble-msg").addEventListener('click', function (event) {
  isChatOpen = true;

  if (document.querySelector('.bot-chat-logs').children.length === 0) {
    bot_response("");
  }

  event.currentTarget.remove();

  const chatCircleStyle = document.querySelector('#bot-chat-circle').style;
  chatCircleStyle.transition = 'width 0.5s, height 0.5s';
  chatCircleStyle.width = '48px';
  chatCircleStyle.height = '48px';
  chatCircleStyle.padding = '12px';
  chatCircleStyle.background = backGroundColor;

  document.querySelector('#chat-circle-img').src = './close.png';

  openChatBox();
})

document.querySelector("#bot-chat-circle").addEventListener('click', function (event) {
  console.log('ABRIENDO')
  var currentTargetStyle = event.currentTarget.style;

  if (document.querySelector('.bot-chat-logs').children.length === 0) {
    bot_response("");
  }

  if (isChatOpen) {
    currentTargetStyle.transition = 'width 0.5s, height 0.5s, padding 0.5s, background 0.5s';
    currentTargetStyle.width = '72px';
    currentTargetStyle.height = '72px';
    currentTargetStyle.background = '#fff';
    currentTargetStyle.padding = '8px';

    document.querySelector('#chat-circle-img').src = iconPath;

    closeChatBox();
  } else {
    const chatBubble = document.querySelector('.bot-chat-bubble-msg');
    if (chatBubble) chatBubble.remove();

    currentTargetStyle.transition = 'width 0.5s, height 0.5s, padding 0.5s, background 0.5s';
    currentTargetStyle.width = '48px';
    currentTargetStyle.height = '48px';
    currentTargetStyle.padding = '12px';
    currentTargetStyle.background = backGroundColor;

    document.querySelector('#chat-circle-img').src = './close.png';

    openChatBox();
  }

  isChatOpen = !isChatOpen;
});

document.addEventListener('click', function (event) {
  const target = event.target;
  if (target.classList.contains("bot-next-car")) {
    const slidesStyle = document.querySelectorAll('.bot-mySlides').style;
    slidesStyle.display = 'none'
    slidesStyle.opacity = '0';

    const slideshowContainer = document.querySelector('.bot-slideshow-container');
    var inx = parseInt(slideshowContainer.getAttribute('pos'));
    if (inx === parseInt(slideshowContainer.getAttribute('last'))) {
      inx = 1;
    } else {
      inx++;
    }

    slideshowContainer.setAttribute('pos', inx);

    const selectedSlideStyle = document.querySelector('.idx' + inx).style;
    setTimeout(() => {
      selectedSlideStyle.display = 'block';
      selectedSlideStyle.opacity = '1';
    }, 300);
  }
});

document.addEventListener('click', function (event) {
  const target = event.target;
  if (target.classList.contains("bot-prev-car")) {
    const slidesStyle = document.querySelectorAll('.bot-mySlides').style;
    slidesStyle.display = 'none';
    slidesStyle.opacity = '0';

    const slideshowContainer = document.querySelector('.bot-slideshow-container');
    var inx = parseInt(slideshowContainer.getAttribute('pos'));
    if (inx === 1) {
      inx = parseInt(slideshowContainer.getAttribute('last'));
    } else {
      inx--;
    }

    slideshowContainer.setAttribute('pos', inx);

    const selectedSlideStyle = document.querySelector('.idx' + inx).style;
    setTimeout(() => {
      selectedSlideStyle.display = 'block';
      selectedSlideStyle.opacity = '1';
    }, 300);
  }
});

document.addEventListener('click', function (event) {
  const target = event.target;
  if (target.classList.contains("bot-open-video")) {
    document.querySelector('.bot-modal').style.display = 'block';

    const modalContentStyle = document.querySelector('.bot-modal-content').style;
    modalContentStyle.margin = '10% auto';
    modalContentStyle.padding = '25px';
    modalContentStyle.width = '78%';

    document.querySelector('.bot-video-frame').style.height = '360px';
    document.querySelector('.bot-open-video').style.display = 'none';
    document.querySelector('.bot-close-video').style.display = 'block';
  }
});

document.addEventListener('click', function (event) {
  const target = event.target;
  if (target.classList.contains("bot-close-video")) {
    const modalContentStyle = document.querySelector('.bot-modal-content').style;
    modalContentStyle.margin = '0% auto';
    modalContentStyle.padding = '2px';
    modalContentStyle.width = '90%';

    document.querySelector('.bot-modal').style.display = 'contents';

    document.querySelector('.bot-video-frame').style.height = '160px';
    document.querySelector('.bot-close-video').style.display = 'none';
    document.querySelector('.bot-open-video').style.display = 'block';
  }
});
