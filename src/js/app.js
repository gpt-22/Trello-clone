import './../less/theme.less'
import {sendRequest} from './helpers'
import {App} from './components/app/App';
import {Header} from './components/header/Header';
import {Board} from './components/board/Board';


const main = async () => {
  sendRequest('POST', 'token/', {
    'username': 'admin',
    'password': 'admin',
  }).then((data) => {
    localStorage.setItem('refreshToken', data['refresh'])
    localStorage.setItem('accessToken', data['access'])
    return sendRequest('GET', 'boards/1/')
  }).then((board) => {
    const app = new App('#app', {
      components: [Header, Board],
      data: {
        0: {},
        1: board,
      },
    })

    app.render()
  })
}

main().catch((err) => console.log(err))

/* TODO:
* fix eslint with 'no-invalid-this'
**/
