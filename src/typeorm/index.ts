import { Profile } from "./profile.entity";
import { Profile_web_project } from "./profile-web-project";
import { User } from "./user.entity";

const entities = [User, Profile, Profile_web_project];

export {User, Profile, Profile_web_project};
export default entities;