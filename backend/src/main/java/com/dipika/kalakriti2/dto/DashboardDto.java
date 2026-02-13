	package com.dipika.kalakriti2.dto;

import java.util.List;

import com.dipika.kalakriti2.entity.ContactMessage;
import com.dipika.kalakriti2.entity.Order;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DashboardDto {

	
	public DashboardDto(long totalOrders2, double totalRevenue2, long totalUsers2, List<Order> recentOrders2) {
		// TODO Auto-generated constructor stub
	}
	private long totalOrders;
    private double totalRevenue;
    private long totalUsers;
    private List<Order> recentOrders;
	private List<ContactMessage> recentContacts;
    
    
	public long getTotalOrders() {
		return totalOrders;
	}
	public void setTotalOrders(long totalOrders) {
		this.totalOrders = totalOrders;
	}
	public double getTotalRevenue() {
		return totalRevenue;
	}
	public void setTotalRevenue(double totalRevenue) {
		this.totalRevenue = totalRevenue;
	}
	public long getTotalUsers() {
		return totalUsers;
	}
	public void setTotalUsers(long totalUsers) {
		this.totalUsers = totalUsers;
	}
	public List<Order> getRecentOrders() {
		return recentOrders;
	}
	public void setRecentOrders(List<Order> recentOrders) {
		this.recentOrders = recentOrders;
	}
    
	 public List<ContactMessage> getRecentContacts() {
	        return recentContacts;
	    }

	    public void setRecentContacts(List<ContactMessage> recentContacts) {
	        this.recentContacts = recentContacts;
	    }
    
}
