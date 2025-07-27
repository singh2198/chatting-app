import React, { useState, useRef } from 'react';
import {useDispatch } from 'react-redux';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Avatar,
  Text,
  VStack
} from '@chakra-ui/react';
import { updateProfile} from "../redux/message/action";



function EditProfileDialog({ isOpen, onClose, user, onSave}) {
  const [name, setName] = useState(user?.name || '');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(user?.avatar || 'https://bit.ly/naruto-sage');
  const [editingName, setEditingName] = useState(false);
  const fileInputRef = useRef(null);
  const dispatch = useDispatch();
  
  const handleAvatarClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
      
    }
  };

  const handleNameClick = () => {
    setEditingName(true);
  };

  const handleNameBlur = (e) => {
    setEditingName(false);
  };

  const handleNameKeyDown = (e) => {
    if (e.key === 'Enter') {
      setEditingName(false);
    }
  };

  // const handleSave = () => {
  //   // if (onSave) onSave({ name, image });
  //   const updateProfilepayload={
  //     image:image?.name,
  //     name,
  //     singupobject_id:user?.singupobject_id,
  //   }
  //   dispatch(updateProfile(updateProfilepayload));
  //   onClose();
  // };

  const handleSave = () => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("singupobject_id", user?.singupobject_id);
    formData.append("image", image); // this should be a File object (from input)
    console.log("formdata",formData);
    
  
    dispatch(updateProfile(formData)); // pass the FormData to your Redux action
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit Profile</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4} align="center">
            <div style={{ position: 'relative', cursor: 'pointer', display: 'inline-block',}}
              onClick={handleAvatarClick} title="Click to change avatar"
            >
              <Avatar size="xl" src={preview} name={name} _hover={{ opacity: 0.8, boxShadow: '0 0 0 2px #3182ce' }} />
              {/* <div style={{  position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(0,0,0,0.5)',
                  color: 'white', fontSize: 12, textAlign: 'center', borderBottomLeftRadius: '50%',
                  borderBottomRightRadius: '50%', padding: '2px 0', pointerEvents: 'none'}}
             >
                Change
              </div> */}
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleImageChange}
                style={{ display: 'none' }}
              />
            </div>
            {editingName ? (
              <input
                type="text"
                value={name}
                autoFocus
                onChange={e => setName(e.target.value)}
                onBlur={handleNameBlur}
                onKeyDown={handleNameKeyDown}
                style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
              />
            ) : (
              <Text
                fontWeight="bold"
                fontSize="lg"
                onClick={handleNameClick}
                style={{ cursor: 'pointer' }}
                title="Click to edit name"
              >
                {name || 'User'}
              </Text>
            )}
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleSave}>
            Save
          </Button>
         
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default EditProfileDialog; 