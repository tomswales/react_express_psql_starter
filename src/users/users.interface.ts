import {User, UserDisplayData} from './user.interface';

// Example of an interface for a collection of person items
export interface Users extends Array<User>{};

export interface UserDisplayDataResult extends Array<UserDisplayData>{};