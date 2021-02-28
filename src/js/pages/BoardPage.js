import {Page} from '../core/router/Page';
import {Header} from '../components/header/Header';
import {Board} from '../components/board/Board';
import {sendRequest} from '../helpers';

export class BoardPage extends Page {
  constructor(props) {
    super(props)

    if (!/^\d+$/.test(props.splitRout[1])) throw new Error('Incorrect path to board')
    this.id = props.splitRout[1]
  }

  setData(id) {
    return sendRequest('GET', `boards/${this.id}/`)
        .then((data) => this.data = data)
  }

  render() {
    this.components.push(Header, Board)
    console.log(this.data)
    const data = {
      0: {},
      1: {...this.data},
    }
    super.render('', data)
  }
}
