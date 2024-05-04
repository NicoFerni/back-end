import { Profile } from "./profile.entity";
import { User } from "./user.entity";
import { SocialNetworks } from "./socialNetworks.entity";
import { Availability } from "./availability.entity";

const entities = [User, Profile, SocialNetworks, Availability];

export {User, Profile, SocialNetworks, Availability};
export default entities;