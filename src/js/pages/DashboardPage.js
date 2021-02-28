import {Page} from '../core/router/Page';
import {sendRequest} from '../helpers';

export class DashboardPage extends Page {
  constructor(props) {
    super(props)
  }

  render() {
    super.render(this.html, {})
  }

  setData() {
    return sendRequest('GET', `boards/`)
        .then((data) => this.data = data)
  }

  get html() {
    return `
        <div class="dashboard">
            <div class="dashboard__body">
        
                <div class="boards-group">
                    <div class="boards-group__header">
                        <img src="img/star.svg" alt="Отмеченные доски" class="boards-group__icon"></img>
                        <div class="boards-group__title">Oтмеченные доски</div>
                    </div>
                    <ul class="boards-group__boards">
        
                        <li class="boards-group__board board board-favourite secondary" draggable="true">
                            <div class="board__body">
                                <div class="board__header">
                                    <div class="board__title">
                                        2020 TIMELINE / TASKS
                                    </div>
                                </div>
                                <div class="board__footer">
                                    <img src="img/star.svg" alt="Добавать в избранное" class="board__add-to-favorites">
                                </div>
                            </div>
                        </li>
                        <li class="boards-group__board board board-favourite secondary" draggable="true">
                            <div class="board__body">
                                <div class="board__header">
                                    <div class="board__title">
                                        2020 TIMELINE / TASKS
                                    </div>
                                </div>
                                <div class="board__footer">
                                    <img src="img/star.svg" alt="Добавать в избранное" class="board__add-to-favorites">
                                </div>
                            </div>
                        </li>
                        <li class="boards-group__board board board-favourite secondary" draggable="true">
                            <div class="board__body">
                                <div class="board__header">
                                    <div class="board__title">
                                        2020 TIMELINE / TASKS
                                    </div>
                                </div>
                                <div class="board__footer">
                                    <img src="img/star.svg" alt="Добавать в избранное" class="board__add-to-favorites">
                                </div>
                            </div>
                        </li>
                        <li class="boards-group__board board board-favourite secondary" draggable="true">
                            <div class="board__body">
                                <div class="board__header">
                                    <div class="board__title">
                                        2020 TIMELINE / TASKS
                                    </div>
                                </div>
                                <div class="board__footer">
                                    <img src="img/star.svg" alt="Добавать в избранное" class="board__add-to-favorites">
                                </div>
                            </div>
                        </li>
                        <li class="boards-group__board board board-favourite secondary" draggable="true">
                            <div class="board__body">
                                <div class="board__header">
                                    <div class="board__title">
                                        2020 TIMELINE / TASKS
                                    </div>
                                </div>
                                <div class="board__footer">
                                    <img src="img/star.svg" alt="Добавать в избранное" class="board__add-to-favorites">
                                </div>
                            </div>
                        </li>
        
                    </ul>
                </div>
        
                <div class="boards-group">
                    <div class="boards-group__header">
                        <img src="img/list.svg" alt="Отмеченные доски" class="boards-group__icon"></img>
                        <div class="boards-group__title">Все доски</div>
                    </div>
                    <ul class="boards-group__boards">
        
                        <li class="boards-group__board board secondary" draggable="true">
                            <div class="board__body">
                                <div class="board__header">
                                    <div class="board__title">
                                        2020 TIMELINE / TASKS
                                    </div>
                                </div>
                                <div class="board__footer">
                                    <img src="img/star.svg" alt="Добавать в избранное" class="board__add-to-favorites">
                                </div>
                            </div>
                        </li>
                        <li class="boards-group__board board secondary" draggable="true">
                            <div class="board__body">
                                <div class="board__header">
                                    <div class="board__title">
                                        2020 TIMELINE / TASKS
                                    </div>
                                </div>
                                <div class="board__footer">
                                    <img src="img/star.svg" alt="Добавать в избранное" class="board__add-to-favorites">
                                </div>
                            </div>
                        </li>
                        <li class="boards-group__board board secondary" draggable="true">
                            <div class="board__body">
                                <div class="board__header">
                                    <div class="board__title">
                                        2020 TIMELINE / TASKS
                                    </div>
                                </div>
                                <div class="board__footer">
                                    <img src="img/star.svg" alt="Добавать в избранное" class="board__add-to-favorites">
                                </div>
                            </div>
                        </li>
                        <li class="boards-group__board board secondary" draggable="true">
                            <div class="board__body">
                                <div class="board__header">
                                    <div class="board__title">
                                        2020 TIMELINE / TASKS
                                    </div>
                                </div>
                                <div class="board__footer">
                                    <img src="img/star.svg" alt="Добавать в избранное" class="board__add-to-favorites">
                                </div>
                            </div>
                        </li>
                        <li class="boards-group__board board secondary" draggable="true">
                            <div class="board__body">
                                <div class="board__header">
                                    <div class="board__title">
                                        2020 TIMELINE / TASKS
                                    </div>
                                </div>
                                <div class="board__footer">
                                    <img src="img/star.svg" alt="Добавать в избранное" class="board__add-to-favorites">
                                </div>
                            </div>
                        </li>
        
                        <li class="boards-group__board create-board default">
                            <span class="create-board__title">Создать доску</span>
                        </li>
        
                    </ul>
                </div>
        
            </div>
        </div>
    `
  }
}
