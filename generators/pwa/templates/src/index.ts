// import './styles.css';
import './views/user-view';
import {Router} from '@vaadin/router';

window.addEventListener('load', () => {
    initRouter();
    registerSW();
});

function initRouter() {
    const router = new Router(document.querySelector('main'));

    const pathPrefix = '/';
    //const pathPrefix = '/pwa-play/';

    router.setRoutes([
        {path: pathPrefix, component: 'user-view'},
        {path: pathPrefix + 'users', component: 'user-view'},
        {path: '(.*)', component: 'not-found-view',
            action: () => import(/* webpackChunkName: "not-found-view" */ './views/not-found-view')
        }
    ]);
}

async function registerSW() {
    if ('serviceWorker' in navigator) {
        try {
            await navigator.serviceWorker.register('./sw.js');
        } catch (e) {
            console.log('ServiceWorker registration failed. Sorry about that.', e);
        }
    } else {
        console.log('Your browser does not support ServiceWorker.');
    }
}
