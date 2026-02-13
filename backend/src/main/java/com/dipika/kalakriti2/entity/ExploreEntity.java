//package com.dipika.kalakriti2.entity;
//
//import jakarta.persistence.Entity;
//import jakarta.persistence.GeneratedValue;
//import jakarta.persistence.GenerationType;
//import jakarta.persistence.Id;
//import jakarta.persistence.Table;
//
//@Entity
//	@Table(name="explore")
//	public class ExploreEntity {
//
//		
//		@Id
//		@GeneratedValue(strategy = GenerationType.IDENTITY)
//		private Long id;
//
//		private String title;
//		private String category;
//		private String img;
//		private Integer price;
//		private String description;
//
//		public ExploreEntity() {}
//
//		public ExploreEntity(Long id, String title, String category, String img, Integer price, String description) {
//			this.id = id;
//			this.title = title;
//			this.category = category;
//			this.img = img;
//			this.price = price;
//			this.description = description;
//		}
//
//		public Long getId() {
//			return id;
//		}
//
//		public void setId(Long id) {
//			this.id = id;
//		}
//
//		public String getTitle() {
//			return title;
//		}
//
//		public void setTitle(String title) {
//			this.title = title;
//		}
//
//		public String getCategory() {
//			return category;
//		}
//
//		public void setCategory(String category) {
//			this.category = category;
//		}
//
//		public String getImg() {
//			return img;
//		}
//
//		public void setImg(String img) {
//			this.img = img;
//		}
//
//		public Integer getPrice() {
//			return price;
//		}
//
//		public void setPrice(Integer price) {
//			this.price = price;
//		}
//		
//		public String getDescription() {
//			return description;
//		}
//		
//		public void setDescription(String description) {
//			this.description = description;
//		}
//
//
//}
