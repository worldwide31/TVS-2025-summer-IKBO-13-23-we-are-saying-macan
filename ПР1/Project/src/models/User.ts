/**
 * Класс представляющий пользователя системы
 */
export class User {
  id: string;
  username: string;
  email: string;
  token: string;
  
  constructor(id: string, username: string, email: string, token: string) {
    this.id = id;
    this.username = username;
    this.email = email;
    this.token = token;
  }
  
  /**
   * Получить данные пользователя для хранения
   */
  toJSON(): object {
    return {
      id: this.id,
      username: this.username,
      email: this.email,
      token: this.token
    };
  }
  
  /**
   * Создать экземпляр пользователя из JSON данных
   */
  static fromJSON(json: any): User {
    return new User(
      json.id,
      json.username,
      json.email,
      json.token
    );
  }
}