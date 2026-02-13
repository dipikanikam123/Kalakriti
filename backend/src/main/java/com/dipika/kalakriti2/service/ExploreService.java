//package com.dipika.kalakriti2.service;
//
//import java.util.List;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Service;
//
//import com.dipika.kalakriti2.entity.ExploreEntity;
//import com.dipika.kalakriti2.repository.ExploreRepo;
//
//@Service
//public class ExploreService {
//
//	@Autowired
//    private ExploreRepo explorerepo;
//
//    public List<ExploreEntity> getAllArtworks() {
//        return explorerepo.findAll();    }
//
//    public List<ExploreEntity> getByCategory(String category) {
//        return explorerepo.findByCategory(category);
//    }
//
//    public ExploreEntity save(ExploreEntity explore) {
//        return explorerepo.save(explore);
//    }
//
//	public Object getById(Long id) {
//		// TODO Auto-generated method stub
//		return null;
//	}
//}
