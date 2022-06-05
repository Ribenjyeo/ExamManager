# 1. API серверной части ExamManager

|          Метод          |          Описание          |          Запрос          |          Ответ          |
|--------|--------|--------|--------|
|  **POST** */login*  |  Проверить зарегистрирован ли пользователь и сгенерировать для него JWT-токен  |  LoginEditModel  |  JwtResponse  |
|  **GET** */user/{id}*  |  Получить информацию о пользователе по его ID  |  id  |  UserDataResponse  |
| **GET** */user/{id}/task/{taskId}* | Получить информацию о задании пользователя по его ID | **id** - идентификатор пользователя<br />**taskId** - идентификатор задания | PersonalTaskDataResponse |
| **GET** */user/{id}/tasks* | Получить информацию о заданиях, которые имеются у пользователя ID | id | PersonalTasksDataResponse |
| **POST** */user/{id}/tasks/add* | Присвоить пользователю задания | AddPersonalTasksRequest | PersonalTasksDataResponse |
| **POST** */user/{id}/tasks/remove* | Убрать задания у пользователя | RemovePersonalTasksRequest | Response |
| **POST** */user/modify* | Изменить данные пользователя | ModifyUserRequest | UserDataResponse |
| **GET** */users* | Получить список информации о пользователях | GetUsersRequest | UsersDataResponse |
| **POST** */users/create* | Зарегистрировать пользователей | CreateUsersRequest | UsersDataResponse |
| **POST** */users/delete* | Удалить пользователей | DeleteUsersRequest | Response |
| **POST** */tasks* | Получить список информации о заданиях | GetTasksRequest | TasksDataResponse |
| **GET** */task/{id}* | Получить информацию о задании по его ID | id | TaskDataResponse |
| **POST** */task/create* | Создать задание | CreateTaskRequest | TaskDataResponse |
| **POST** */task/delete* | Удалить задание | DeleteTaskRequest | Response |
| **POST** */task/modify* | Изменить задание | ModifyTaskRequest | TaskDataResponse |
| **GET** */task/{taskId}/start/{id}* | Запустить виртуальную машину по ее ID | **taskId** - идентификатор задания<br />**id** - идентификатор образа виртуальной машины | Response |
| **GET** */task/{taskId}/status/{id}* | Получить информацию о статусе виртуальной машины | **taskId** - идентификатор задания<br />**id** - идентификатор образа виртуальной машины | TaskStatusResponse |
| **GET** */task/{taskId}/connect/{id}* | Подключиться к виртуальной машине | **taskId** - идентификатор задания<br />**id** - идентификатор образа виртуальной машины | File |
| **GET** */task/{taskId}/check* | Начать проверку выполнения задания | **taskId** - идентификатор задания | Response |
| **GET** */task/{taskId}/stop/{id}* | Остановить виртуальную машину по ее ID | **taskId** - идентификатор задания<br />**id** - идентификатор образа виртуальной машины | Response |
| **GET** */group/{id}* | Получить информацию о группе по ее ID | id | GroupDataResponse |
| **GET** */group/{id}/students* | Получить информацию о студентах, которые состоят в группе ID | id | UsersDataResponse |
| **GET** */group/{id}/delete* | Удалить группу | id | Response |
| **POST** */group/create* |  Создать группу студентов  |  CreateGroupRequest  |  GroupDataResponse  |
| **POST** */group/students/add* | Добавить студентов к группе | AddStudentsRequest | UsersDataResponse |
| **POST** */group/students/remove* | Удалить студентов из группы | RemoveStudentsRequest | UsersDataResponse |
| **POST** */groups* | Получить информацию о группах | GetGroupsRequest | GroupsDataResponse |

# 2. Структура запросов

## LoginEditModel

| Поле     | Тип данных | Обязательно | Описание            |
| -------- | ---------- | ----------- | ------------------- |
| login    | string     | Да          | Логин пользователя  |
| password | string     | Да          | Пароль пользователя |



## AddPersonalTasksRequest

<table>
    <tr>
        <th colspan=2>Поле</th>
        <th>Тип данных</th>
        <th>Обязательно</th>
        <th>Описание</th>
    </tr>
    <tr>
        <td colspan=2>tasks</td>
        <td>array</td>
        <td></td>
        <td></td>
    </tr>
    <tr>
        <td></td>
        <td>id</td>
        <td>guid</td>
        <td>Да</td>
        <td>Идентификатор задания</td>
    </tr>
</table>



## RemovePersonalTasksRequest

<table>
    <tr>
        <th colspan=2>Поле</th>
        <th>Тип данных</th>
        <th>Обязательно</th>
        <th>Описание</th>
    </tr>
    <tr>
        <td colspan=2>pesronalTasks</td>
        <td>array</td>
        <td></td>
        <td></td>
    </tr>
    <tr>
        <td></td>
        <td>id</td>
        <td>guid</td>
        <td>Да</td>
        <td>Идентификатор задания у пользователя</td>
    </tr>
</table>


## GetTasksRequest

<table>
    <tr>
    	<th>Поле</th>
    	<th>Тип данных</th>
    	<th>Обязательно</th>
    	<th>Описание</th>
    </tr>
    <tr>
    	<td>title</td>
    	<td>string</td>
    	<td></td>
    	<td>Название задания</td>
    </tr>
    <tr>
    	<td>studentIds</td>
    	<td>array(guid)</td>
    	<td></td>
        <td>
            Массив идентификаторов студентов, задания<br/> 
            которых будут добавлены в выборку
        </td>
    </tr>
</table>


## CreateTaskRequest

<table>
    <tr>
    	<th colspan=2>Поле</th>
    	<th>Тип данных</th>
    	<th>Обязательно</th>
    	<th>Описание</th>
    </tr>
    <tr>
    	<td colspan=2>title</td>
        <td>string</td>
        <td>Да</td>
        <td>Название задания</td>
    </tr>
    <tr>
    	<td colspan=2>description</td>
        <td>string</td>
        <td>Да</td>
        <td>Описание задания</td>
    </tr>
    <tr>
    	<td colspan=2>virtualMachines</td>
        <td>array</td>
        <td></td>
        <td></td>
    </tr>
    <tr>
    	<td></td>
    	<td>id</td>
        <td>string</td>
        <td>Да</td>
        <td>Идентификатор виртуальной машины</td>
    </tr>
    <tr>
    	<td></td>
    	<td>title</td>
        <td>string</td>
        <td></td>
        <td>Название виртуальной машины</td>
    </tr>
    <tr>
    	<td></td>
    	<td>order</td>
        <td>int</td>
        <td></td>
        <td>Порядковый номер виртуальной машины</td>
    </tr>
</table>



## DeleteTaskRequest

| Поле   | Тип данных | Обязательно | Описание                               |
| ------ | ---------- | ----------- | -------------------------------------- |
| taskId | guid       | Да          | ID задания, которое необходимо удалить |



## ModifyTaskRequest

В теле данного запроса значения всех полей кроме *taskId* заменят текущие значения полей задания 

| Поле        | Тип данных | Обязательно | Описание                                |
| ----------- | ---------- | ----------- | --------------------------------------- |
| taskId      | guid       | Да          | ID задания, которое необходимо изменить |
| title       | string     |             | Название задания                        |
| description | string     |             | Описание задания                        |



## CreateGroupRequest

| Поле | Тип данных | Обязательно | Описание        |
| ---- | ---------- | ----------- | --------------- |
| name | string     | Да          | Название группы |



## AddStudentsRequest

<table>
    <tr>
    	<th colspan=2>Поле</th>
        <th>Тип данных</th>
        <th>Обязательно</th>
        <th>Описание</th>
    </tr>
    <tr>
    	<td colspan=2>groupId</td>
        <td>guid</td>
        <td>Да</td>
        <td>ID группы, в которую будут добавлены студенты</td>
    </tr>
    <tr>
    	<td colspan=2>students</td>
        <td>array</td>
        <td></td>
        <td></td>
    </tr>
    <tr>
        <td></td>
        <td>id</td>
        <td>guid</td>
        <td>Да</td>
        <td>ID студента, которого необходимо добавить в группу</td>    	
    </tr>
</table>



## RemoveStudentsRequest

<table>
    <tr>
    	<th colspan=2>Поле</th>
    	<th>Тип данных</th>
    	<th>Обязательно</th>
    	<th>Описание</th>
    </tr>
    <tr>
    	<td colspan=2>students</td>
        <td>array</td>
        <td></td>
        <td></td>
    </tr>    
    <tr>
    	<td></td>
        <td>id</td>
    	<td>guid</td>
        <td>Да</td>
        <td>ID студента, которого необходимо убрать из группы</td>
    </tr> 
</table>



## GetUsersRequest

| Поле            | Тип данных | Обязательно | Описание                                                     |
| --------------- | ---------- | ----------- | ------------------------------------------------------------ |
| name            | string     |             | Полное имя пользователя                                      |
| firstName       | string     |             | Имя пользователя                                             |
| lastName        | string     |             | Фамилия пользователя                                         |
| excludeYourself | bool       |             | При значении **true** пользователь, запрашивающий информацию, не будет добавлен в выборку |
| withoutGroup    | bool       |             | При значении **true** пользователи, которые не состоят в группе, будут добавлены в выборку. При этом значения полей *groupIds*, *excludeGroupIds* не будут учитываться |
| groupIds        | guid[]     |             | ID групп, пользователи которых будут добавлены в выборку     |
| excludeGroupIds | guid[]     |             | ID групп, пользователи которых не будут добавлены в выборку  |
| taskIds         | guid[]     |             | ID заданий, при наличии которых пользователи будут добавлены в выборку |
| excludeTaskIds  | guid[]     |             | ID заданий, при наличии которых пользователи не будут добавлены в выборку |
| taskStatus      | int        |             | Статус задания, при наличии которого (хотя бы одного задания<br />с таким статусом) пользователь будет добавлен в выборку |
| role            | int        |             | Роль, пользователи имеющие которую будут добавлены в выборку |



## CreateUsersRequest

<table>
    <tr>
        <th colspan=2>Поле</th>
        <th>Тип данных</th>
        <th>Обязательно</th>
        <th>Описание</th>
    </tr>
    <tr>
        <td colspan=2>users</td>
        <td>array</td>
        <td></td>
        <td></td>
    </tr>
    <tr>
    	<td></td>
        <td>login</td>
        <td>string</td>
        <td>Да</td>
        <td>Логин</td>
    </tr>
    <tr>
    	<td></td>
        <td>password</td>
        <td>string</td>
        <td>Да</td>
        <td>Пароль</td>
    </tr>
    <tr>
    	<td></td>
        <td>firstName</td>
        <td>string</td>
        <td>Да</td>
        <td>Имя</td>
    </tr>
    <tr>
    	<td></td>
        <td>lastName</td>
        <td>string</td>
        <td>Да</td>
        <td>Фамилия</td>
    </tr>
    <tr>
        <td></td>
        <td>role</td>
        <td>int</td>
        <td>Да</td>
        <td>
            Роль пользователя<br/>
            <b>0</b> - администратор<br/>
            <b>1</b> - студент
        </td>
    </tr>
    <tr>
        <td></td>
        <td>groupId</td>
        <td>guid</td>
        <td></td>
        <td>ID группы, для которой будет создан пользователь (студент)</td>
    </tr>
</table>


## DeleteUsersRequest

<table>
    <tr>
    	<th colspan=2>Поле</th>
        <th>Тип данных</th>
        <th>Обязательно</th>
        <th>Описание</th>
    </tr>
    <tr>
    	<td colspan=2>users</td>
        <td>array</td>
        <td></td>
        <td></td>
    </tr>
    <tr>
    	<td></td>
        <td>id</td>
    	<td>guid</td>
    	<td>Да</td>
    	<td>ID пользователя, которого необходимо удалить</td>
    </tr>
    <tr>
    	<td></td>
        <td>onlyLogin</td>
    	<td>boolean</td>
    	<td>Да</td>
    	<td>
            В обоих случаях пользователь лишится возможности авторизоваться в системе<br/>
            <b>true</b> - информация о пользователе сохранится<br/>
            <b>false</b> - информацию о пользователе будет удалена
        </td>
    </tr>
</table>



## GetGroupsRequest

<table>
    <tr>
    	<th>Поле</th>
        <th>Тип данных</th>
        <th>Обязательно</th>
        <th>Описание</th>
    </tr>
    <tr>
    	<td>name</td>
    	<td>string</td>
    	<td></td>
    	<td>Часть названия группы</td>
    </tr>
    <tr>
    	<td>minStudentsCount</td>
    	<td>int</td>
    	<td></td>
    	<td>Минимальное число студентов в группе</td>
    </tr>
    <tr>
    	<td>maxStudentsCount</td>
    	<td>int</td>
    	<td></td>
    	<td>Максимальное число студентов в группе</td>
    </tr>
    <tr>
    	<td>count</td>
    	<td>int</td>
    	<td></td>
    	<td>Максимальное число групп в выборке</td>
    </tr>
</table>



## ModifyUserRequest

<table>
    <tr>
    	<th>Поле</th>
        <th>Тип данных</th>
        <th>Обязательно</th>
        <th>Описание</th>
    </tr>
    <tr>
    	<td>id</td>
        <td>guid</td>
        <td></td>
        <td>ID пользователя</td>
    </tr>
    <tr>
    	<td>login</td>
        <td>string</td>
        <td></td>
        <td>Логин пользователя</td>
    </tr>
    <tr>
    	<td>password</td>
        <td>string</td>
        <td></td>
        <td>Пароль пользователя</td>
    </tr>
    <tr>
    	<td>firstName</td>
        <td>string</td>
        <td></td>
        <td>Имя пользователя</td>
    </tr>
    <tr>
    	<td>lastName</td>
        <td>string</td>
        <td></td>
        <td>Фамилия пользователя</td>
    </tr>
    <tr>
    	<td>role</td>
        <td>int</td>
        <td></td>
        <td>Роль пользователя</td>
    </tr>
</table>



# 3. Структура ответов

Каждый ответ имеет в своем теле поле *type*, в котором указан тип ответа, а также *status*, содержащий статус результата запроса.

## Response

| Поле    | Тип данных | Описание                         |
| ------- | ---------- | -------------------------------- |
| status  | string     | Статус результата запроса (HTTP) |
| message | string     | Информационное сообщение         |
| type    | string     | Тип ответа                       |



## JwtResponse

<table>
    <tr>
    	<th>Поле</th>
        <th>Тип данных</th>
        <th>Описание</th>
    </tr>
    <tr>
    	<td>token</td>
        <td>string</td>
        <td>Токен, используемый при совершении запросов<br/>авторизованным пользователем</td>
    </tr>
    <tr>
    	<td>id</td>
        <td>guid</td>
        <td>ID пользователя</td>
    </tr>
</table>


## UserDataResponse

<table>
    <tr>
    	<th colspan=2>Поле</th>
        <th>Тип данных</th>
        <th>Описание</th>
    </tr>
    <tr>
    	<td colspan=2>id</td>
        <td>guid</td>
        <td>ID пользователя</td>
    </tr>
    <tr>
    	<td colspan=2>firstName</td>
        <td>string</td>
        <td>Имя пользователя</td>
    </tr>
    <tr>
    	<td colspan=2>lastName</td>
        <td>string</td>
        <td>Фамилия пользователя</td>
    </tr>
    <tr>
    	<td colspan=2>groupId</td>
        <td>guid</td>
        <td>Группа, в которую входит пользователь</td>
    </tr>
    <tr>
    	<td colspan=2>role</td>
        <td>int</td>
        <td>
            Роль пользователя<br/>
            <b>0</b> - администратор<br/>
            <b>1</b> - студент
        </td>
    </tr>
    <tr>
    	<td colspan=2>tasks</td>
        <td>array</td>
        <td></td>
    </tr>
    <tr>
    	<td></td>
    	<td>id</td>
        <td>guid</td>
        <td>ID задания</td>
    </tr>
    <tr>
    	<td></td>
    	<td>title</td>
        <td>string</td>
        <td>Название задания</td>
    </tr>
</table>


## UsersDataResponse

<table>
    <tr>
    	<th colspan=3>Поле</th>
        <th>Тип данных</th>
        <th>Описание</th>
    </tr>
    <tr>
    	<td colspan=3>users</td>
        <td>array</td>
        <td></td>
    </tr>
    <tr>
    	<td></td>
        <td colspan=2>id</td>
        <td>guid</td>
        <td>ID пользователя</td>
    </tr>
    <tr>
    	<td></td>
        <td colspan=2>firstName</td>
        <td>string</td>
        <td>Имя</td>
    </tr>
    <tr>
    	<td></td>
        <td colspan=2>lastName</td>
        <td>string</td>
        <td>Фамилия</td>
    </tr>
    <tr>
    	<td></td>
        <td colspan=2>groupName</td>
        <td>string</td>
        <td>Название группы</td>
    </tr>
    <tr>
    	<td></td>
        <td colspan=2>tasks</td>
        <td>array</td>
        <td></td>
    </tr>
    <tr>
    	<td></td>
    	<td></td>
        <td>title</td>
        <td>string</td>
        <td>Название задания</td>
    </tr>
    <tr>
    	<td></td>
    	<td></td>
        <td>status</td>
        <td>int</td>
        <td>Статус задания</td>
    </tr>
</table>


## TasksDataResponse

<table>
    <tr>
    	<th colspan=2>Поле</th>
        <th>Тип данных</th>
        <th>Описание</th>
    </tr>
    <tr>
    	<td colspan=2>tasks</td>
        <td>array</td>
        <td></td>
    </tr>
    <tr>
    	<td></td>
        <td>id</td>
        <td>guid</td>
        <td>ID задания</td>
    </tr>
    <tr>
    	<td></td>
        <td>number</td>
        <td>ushort</td>
        <td>Внутренний номер задания</td>
    </tr>
    <tr>
    	<td></td>
        <td>title</td>
        <td>string</td>
        <td>Название</td>
    </tr>
    <tr>
    	<td></td>
        <td>description</td>
        <td>string</td>
        <td>Описание</td>
    </tr>    
</table>



## TaskDataResponse

<table>
    <tr>
    	<th colspan=2>Поле</th>
    	<th>Тип данных</th>
    	<th>Описание</th>
    </tr>
    <tr>
    	<td colspan=2>id</td>
    	<td>guid</td>
    	<td>ID задания</td>
    </tr>
    <tr>
    	<td colspan=2>title</td>
    	<td>string</td>
    	<td>Название</td>
    </tr>
    <tr>
    	<td colspan=2>description</td>
    	<td>string</td>
    	<td>Описание</td>
    </tr>
    <tr>
    	<td colspan=2>virtualMachines</td>
    	<td>array</td>
    	<td></td>
    </tr>
    <tr>
    	<td></td>
    	<td>id</td>
    	<td>guid</td>
    	<td>ID образа виртуальной машины</td>
    </tr>
    <tr>
    	<td colspan=2>students</td>
    	<td>array</td>
    	<td></td>
    </tr>
    <tr>
    	<td></td>
    	<td>id</td>
    	<td>guid</td>
    	<td>ID пользователя</td>
    </tr>
    <tr>
    	<td></td>
    	<td>fullName</td>
    	<td>string</td>
    	<td>Фамилия, имя пользователя</td>
    </tr>
</table>




## TaskStatusResponse

| Поле       | Тип данных | Описание                                                     |
| ---------- | ---------- | ------------------------------------------------------------ |
| id         | string     | Идентификатор образа виртуальной машины                      |
| vMachineId | string     | Идентификатор виртуальной машины                             |
| status     | int        | Код статуса виртуальной машины<br />**1** - RUNNING<br />**2** - KILLED |



## PersonalTaskDataResponse

<table>
    <tr>
    	<th colspan=3>Поле</th>
    	<th>Тип данных</th>
    	<th>Описание</th>
    </tr>
    <tr>
    	<td colspan=3>title</td>
        <td>string</td>
        <td>Название задания</td>
    </tr>
    <tr>
    	<td colspan=3>number</td>
        <td>ushort</td>
        <td>Внутренний номер задания</td>
    </tr>
    <tr class="new">
    	<td colspan=3>description</td>
        <td>string</td>
        <td>Описание задания</td>
    </tr>
    <tr>
    	<td colspan=3>status</td>
        <td>int</td>
        <td>Статус задания</td>
    </tr>
    <tr>
        <td colspan=3>message</td>
        <td>string</td>
        <td>Комментарий к статусу задания</td>
    </tr>
    <tr>
    	<td colspan=3>virtualMachines</td>
        <td>array</td>
        <td></td>
    </tr>
    <tr>
        <td></td>
    	<td colspan=2>image</td>
        <td>object</td>
        <td>Образ виртуальной машины</td>
    </tr>
    <tr>
        <td></td>
        <td></td>
    	<td>id</td>
        <td>string</td>
        <td>Идентификатор образа виртуальной машины</td>
    </tr>
    <tr>
        <td></td>
    	<td colspan=2>instance</td>
        <td>object</td>
        <td>Виртуальная машина</td>
    </tr>
    <tr>
        <td></td>
        <td></td>
    	<td>status</td>
        <td>int</td>
        <td>Статус виртуальной машины</td>
    </tr>
</table>



## PersonalTasksDataResponse

<table>
    <tr>
    	<th colspan=3>Поле</th>
    	<th>Тип данных</th>
    	<th>Описание</th>
    </tr>
    <tr>
    	<td colspan=3>personalTasks</td>
        <td>array</td>
        <td></td>
    </tr>
    <tr>
    	<td></td>
    	<td colspan=2>studentId</td>
        <td>guid</td>
        <td>Идентификатор студента, которому присвоены задания</td>
    </tr>
    <tr>
    	<td></td>
    	<td colspan=2>tasks</td>
        <td>array</td>
        <td></td>
    </tr>
    <tr>
    	<td></td>
    	<td></td>
        <td>id</td>
        <td>guid</td>
        <td>Идентифкатор персонального задания</td>
    </tr>
    <tr>
    	<td></td>
    	<td></td>
        <td>title</td>
        <td>string</td>
        <td>Название задания</td>
    </tr>
    <tr>
    	<td></td>
    	<td></td>
        <td>description</td>
        <td>string</td>
        <td>Описание задания</td>
    </tr>
    <tr>
    	<td></td>
    	<td></td>
        <td>number</td>
        <td>ushort</td>
        <td>Внутренний номер задания</td>
    </tr>
    <tr>
    	<td></td>
    	<td></td>
        <td>status</td>
        <td>int</td>
        <td>Статус персонального задания</td>
    </tr>
</table>



## GroupDataResponse

| Поле          | Тип данных | Описание                                 |
| ------------- | ---------- | ---------------------------------------- |
| id            | guid       | ID группы                                |
| name          | string     | Название                                 |
| studentsCount | int        | Количество студентов, состоящих в группе |



## GroupsDataResponse

<table>  
    <tr>
    	<th colspan=2>Поле</th>
    	<th>Тип данных</th>
    	<th>Описание</th>
    </tr>
    <tr>
    	<td colspan=2>groups</td>
        <td></td>
        <td></td>
    </tr>
    <tr>
        <td></td>
    	<td>id</td>
        <td>guid</td>
        <td>ID группы</td>
    </tr>
    <tr>
        <td></td>
    	<td>name</td>
        <td>string</td>
        <td>Название группы</td>
    </tr>
    <tr>
        <td></td>
    	<td>studentsCount</td>
        <td>int</td>
        <td>Количество студентов, состоящих в группе</td>
    </tr>
</table>



## ErrorsResponse

<table>
    <tr>
    	<th colspan=3>Поле</th>
    	<th>Тип данных</th>
    	<th>Описание</th>
    </tr>
    <tr>
    	<td colspan=3>errors</td>
    	<td>dict</td>
    	<td></td>
    </tr>
    <tr>
    	<td></td>
    	<td colspan=2><i>element</i></td>
    	<td></td>
    	<td></td>
    </tr>
    <tr>
    	<td></td>
    	<td></td>
    	<td>key</td>
    	<td>string</td>
    	<td>Название элемента, к которому относится ошибка</td>
    </tr>
    <tr>
    	<td></td>
    	<td></td>
    	<td>value</td>
    	<td>string</td>
    	<td>Описание ошибки</td>
    </tr>
</table>



## BadResponse

| Поле          | Тип данных | Описание                  |
| ------------- | ---------- | ------------------------- |
| exceptionType | string     | Тип вызванного исключения |
| message       | string     | Описание исключения       |
| stackTrace    | string     | Стек вызовов              |

