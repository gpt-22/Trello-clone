import './../less/theme.less'
import {sendRequest} from './helpers'
import {DashboardPage} from './pages/DashboardPage';
import {BoardPage} from './pages/BoardPage';
import {App} from './core/App';


const main = async () => {
  sendRequest('POST', 'token/', {
    'username': 'admin',
    'password': 'admin',
  }).then((data) => {
    localStorage.setItem('refreshToken', data['refresh'])
    localStorage.setItem('accessToken', data['access'])

    new App('#app', {
      routes: {
        'dashboard': DashboardPage,
        'board': BoardPage,
      },
    })
  })
}

main().catch((err) => console.log(err))

/* TODO: fix eslint with 'no-invalid-this' */
