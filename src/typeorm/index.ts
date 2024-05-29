import { Profile } from "./profile.entity";
import { User } from "./user.entity";
import { redes } from "./socialNetworks.entity";
import { disponibilidad } from "./availability.entity";

const entities = [User, Profile, redes, disponibilidad];

export {User, Profile, redes, disponibilidad};
export default entities;