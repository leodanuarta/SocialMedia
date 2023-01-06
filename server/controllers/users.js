import User from '../models/User.js';

// READ 
export const getUser = async (req, res, next) => {
  try {
    const {id} = req.params;
    const user = await User.findById(id);
    res.status(200).json(user)
  } 
  catch (err) {
    res.status(404).json({message: err.message});
  }
}

export const getUserFriends = async (req, res) => {
  try{
    const {id} = req.params;
    const user = await User.findById(id);
  
    const friends = await Promise.all(
      user.friends.map((id) => User.findById(id))
    );
  
    const formattedFriends = friends.map(
      ({ _id, firstName, lastName, occupation, location, picturePath}) => {
        return { _id, firstName, lastName, occupation, location, picturePath};
      }
    );
    res.status(200).json(formattedFriends)
  }  
  catch (err){
    res.status(404).json({message: err.message});
  }
  
  res.status(200).json(formattedFriends)
}

// UPDATE
export const addRemoveFriends = async (req, res) => {
  try {
    const {id, friendId} = req.params;
    const user = await User.findById(id);
    const friend = await User.findById(friendId);
  
    if (user.friends.includes(friendId)) {
      user.friends = user.friends.filter((id) => id !== friendId);
      friend.friends = friend.friends.filter((id) => id !== id)
    }else {
      user.friends.push(friendId);
      friend.friends.push(id)
    }
    await user.save();
    await friend.save();
  } 
  catch(err){
    res.status(404).json({message: err.message});
  }
}