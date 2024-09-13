// utils/presenter.js

class UserPresenter {
    constructor(user) {
      this.user = user;
    }
  
    toJSON() {
      
      return {
        id: this.user.id,
        firstName: this.user.firstName,
        lastName: this.user.lastName,
        email: this.user.email,
        createdAt: this.user.createdAt,
        updatedAt: this.user.updatedAt,
        
      };
    }
  }
  
  module.exports = UserPresenter;
  