// 输出项目信息到控制台
console.log(
    '%cbuild from PakePlus： https://github.com/Sjj1024/PakePlus',
    'color:orangered;font-weight:bolder'
);

let isEventListenerAdded = false;

const addGlobalClickListener = () => {
    if (isEventListenerAdded) return; // 防止重复添加事件监听器

    document.addEventListener('click', hookClick, { capture: true });
    isEventListenerAdded = true;
};

// 钩子点击事件函数
const hookClick = (e) => {
    const origin = e.target.closest('a,[data-url]'); // 支持带有data-url属性的元素
    const isBaseTargetBlank = document.querySelector('head base[target="_blank"]');

    if (!origin || !(origin.href || origin.dataset.url)) return; // 如果没有找到有效的链接，则返回

    try {
        let url = origin.href || origin.dataset.url;
        // 解析相对路径
        if (!/^https?:\/\//i.test(url)) {
            url = new URL(url, window.location.href).href;
        }
        const parsedUrl = new URL(url);
        if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
            console.warn(`Invalid protocol for URL: ${parsedUrl.href}`);
            return;
        }

        if ((origin.target === '_blank') || isBaseTargetBlank) {
            e.preventDefault(); // 阻止默认行为
            console.log('Handling origin:', origin);
            location.href = parsedUrl.href; // 在当前页面打开链接
            
            // 给用户的简单反馈
            alert('即将跳转至: ' + parsedUrl.href); // 或者使用更友好的方式通知用户
        } else {
            console.log('Not handling origin:', origin);
        }
    } catch (error) {
        console.error('Error parsing URL:', error);
    }
};

// 覆盖window.open方法以确保兼容性并避免破坏原有功能
const originalWindowOpen = window.open;
window.open = function (url, target = '_blank', features) {
    if (target === '_blank') {
        console.log('Opening in current tab due to hook:', url);
        location.href = url; // 强制在当前标签页打开
    } else {
        originalWindowOpen.call(window, url, target, features); // 使用原始window.open行为
    }
};

addGlobalClickListener();