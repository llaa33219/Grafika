function injectScript(filePath) {
    const script = document.createElement('script');
    script.src = chrome.runtime.getURL(filePath);
    // Use 'text/javascript' to ensure it runs in the page's context
    script.type = 'text/javascript'; 
    (document.head || document.documentElement).appendChild(script);
}

// 먼저 제공된 WebGL 토글 로직을 페이지에 주입합니다.
injectScript('WebGL-toggle.js');

// 그 다음, UI 생성 및 상호작용을 담당하는 메인 스크립트를 주입합니다.
injectScript('main.js');
