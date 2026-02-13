package com.dipika.kalakriti2.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.dipika.kalakriti2.dto.ContactAdminDto;
import com.dipika.kalakriti2.entity.ContactImage;
import com.dipika.kalakriti2.entity.ContactMessage;
import com.dipika.kalakriti2.repository.ContactImageRepository;
import com.dipika.kalakriti2.repository.ContactRepository;

@Service
public class ContactService {

    @Autowired
    private ContactRepository contactRepository;

    @Autowired
    private ContactImageRepository imageRepository;

    public List<ContactAdminDto> getAdminContacts() {

        List<ContactMessage> contacts = contactRepository.findAll();
        List<ContactAdminDto> result = new ArrayList<>();

        for (ContactMessage c : contacts) {
            ContactAdminDto dto = new ContactAdminDto();

            dto.setId(c.getId());
            dto.setName(c.getName());
            dto.setEmail(c.getEmail());
            dto.setPhone(c.getPhone());
            dto.setAddress(c.getAddress()); // Get address
            dto.setMessage(c.getMessage());

            // Image Mapping from Entity directly (@ElementCollection)
            // No need for separate ImageRepository as images are fetched with the entity
            if (c.getImages() != null && !c.getImages().isEmpty()) {
                dto.setImages(c.getImages());
            } else {
                 dto.setImages(new ArrayList<>());
            }
            
            dto.setCreatedAt(c.getCreatedAt()); // Get date

            result.add(dto);
        }

        return result;
    }

    public List<ContactMessage> getAllContacts() {
        return contactRepository.findAll();
    }

    public void deleteContact(Long id) {
        contactRepository.deleteById(id);
    }

    public List<ContactMessage> getUserCommissions(String email) {
        return contactRepository.findByEmail(email);
    }


}
