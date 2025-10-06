(function() {
    'use strict';

    const TARGET_CLASS = 'css-1m47uzz'; // 특정 div를 찾기 위한 클래스
    const TOGGLE_SWITCH_ID = 'webgl-toggle-switch-container';

    // 토글 스위치 UI를 생성하고 페이지에 삽입하는 함수
    function createToggleSwitch() {
        if (document.getElementById(TOGGLE_SWITCH_ID)) {
            return; // 이미 스위치가 존재하면 중복 생성 방지
        }

        const container = document.createElement('div');
        container.id = TOGGLE_SWITCH_ID;
        container.className = 'webgl-toggle-container';

        const label = document.createElement('span');
        label.className = 'label';
        label.textContent = '부스트모드';
        
        const switchLabel = document.createElement('label');
        switchLabel.className = 'webgl-toggle-switch';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = 'webgl-mode-checkbox';

        const slider = document.createElement('span');
        slider.className = 'slider';

        switchLabel.appendChild(checkbox);
        switchLabel.appendChild(slider);

        container.appendChild(label);
        container.appendChild(switchLabel);
        
        const targetElement = document.querySelector(`.${TARGET_CLASS}`);
        if (targetElement) {
            targetElement.parentNode.insertBefore(container, targetElement);
            console.log('WebGL 토글 스위치가 페이지에 추가되었습니다.');
        } else {
            console.error('토글 스위치를 추가할 대상 요소를 찾지 못했습니다.');
        }
    }

    // Entry 객체의 상태를 읽어와 토글 스위치의 ON/OFF 상태를 동기화하는 함수
    function syncToggleState() {
        const checkbox = document.getElementById('webgl-mode-checkbox');
        if (!checkbox) return;

        if (window.Entry && window.Entry.options) {
            const isWebGL = !!window.Entry.options.useWebGL;
            checkbox.checked = isWebGL;
            console.log(`토글 상태 동기화: WebGL 모드 ${isWebGL ? '활성화' : '비활성화'}`);
        }
    }

    // 토글 스위치에 이벤트 리스너를 추가하는 함수
    function addToggleListener() {
        const checkbox = document.getElementById('webgl-mode-checkbox');
        if (checkbox && !checkbox.dataset.listenerAttached) {
            checkbox.addEventListener('change', () => {
                if (window.Entry && typeof window.Entry.toggleWebGLMode === 'function') {
                    console.log('토글 스위치 클릭됨, Entry.toggleWebGLMode() 호출');
                    window.Entry.toggleWebGLMode();
                } else {
                    console.error('Entry.toggleWebGLMode() 함수를 찾을 수 없습니다.');
                    alert('WebGL 모드를 전환할 수 없습니다. Entry 객체를 확인해주세요.');
                }
            });
            checkbox.dataset.listenerAttached = 'true';
        }
    }

    // 메인 로직 실행 함수
    function initialize() {
        // 1. 페이지에 특정 요소가 나타나는 것을 감지하여 UI를 생성합니다.
        const observer = new MutationObserver((mutations, obs) => {
            const targetElement = document.querySelector(`.${TARGET_CLASS}`);
            if (targetElement) {
                createToggleSwitch();
                addToggleListener();
                syncToggleState(); // UI 생성 후 즉시 상태 동기화
                obs.disconnect(); // 요소를 찾았으므로 관찰 중지
            }
        });

        // body 전체의 변화를 관찰 시작
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // 2. Entry 객체의 생성/소멸을 지속적으로 감지하여 스위치 상태를 동기화합니다.
        // toggleWebGLMode 실행 시 Entry 객체가 잠시 사라졌다가 다시 생성되므로, 이를 감지해야 합니다.
        let entryExists = false;
        setInterval(() => {
            const currentEntryExists = !!(window.Entry && window.Entry.init);
            if (currentEntryExists !== entryExists) {
                entryExists = currentEntryExists;
                if (entryExists) {
                    console.log('Entry 객체가 감지되었습니다.');
                    // Entry가 로드된 후 잠시 기다렸다가 동기화하여 정확성 확보
                    setTimeout(syncToggleState, 500); 
                } else {
                    console.log('Entry 객체가 페이지에서 사라졌습니다.');
                }
            }
        }, 500); // 0.5초마다 Entry 객체 존재 여부 확인
    }

    // 페이지 로드가 완료되면 스크립트 실행
    if (document.readyState === 'complete') {
        initialize();
    } else {
        window.addEventListener('load', initialize);
    }

})();
