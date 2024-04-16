import { Profile } from "./profile.entity";
import { User } from "./user.entity";
import { SocialNetworks } from "./socialNetwork.entity";

const entities = [User, Profile, SocialNetworks];

export {User, Profile, SocialNetworks};
export default entities;