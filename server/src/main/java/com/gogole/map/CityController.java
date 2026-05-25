package com.gogole.map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@CrossOrigin(origins = "*") //ajouter le  25/02
@RestController
@RequestMapping("/api/cities")
public class CityController {

	private final CityService cityService;


	public CityController(CityService cityService) {
		this.cityService = cityService;
	}


	public List<City> getAllCities() {
		return cityService.getAllCities();
	}

	@GetMapping("/{name}")
	public City getCityByName(@PathVariable String name) {
		return cityService.getCityByName(name);
	}

	@GetMapping("/nearest")
	public ResponseEntity<List<City>> getNearestCities(@RequestParam double latitude,
													   @RequestParam double longitude,
													   @RequestParam int nb,
													   @RequestParam int radius,
													   @RequestParam int population,
													   @RequestParam String region) {

		List<City> nearestCities = cityService.getNearestCities(latitude, longitude, nb, radius, population, region);
		return new ResponseEntity<>(nearestCities, HttpStatus.OK);
	}

	@GetMapping("/regions")
	public ResponseEntity<List<String>> getRegions() {

		List<String> regions = this.cityService.getRegions();


		return new ResponseEntity<>(regions, HttpStatus.OK);
	}

	@PostMapping
	public ResponseEntity<City> createCity(@RequestBody City city) {
		City createdCity = cityService.createCity(city);
		return new ResponseEntity<>(createdCity, HttpStatus.CREATED);
	}

	@PutMapping("/{name}")
	public ResponseEntity<City> updateCity(@PathVariable String name, @RequestBody City updatedCity) {
		City city = cityService.updateCity(name, updatedCity);
		if (city != null) {
			return new ResponseEntity<>(city, HttpStatus.OK);
		} else {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
	}

	@DeleteMapping("/{name}")
	public ResponseEntity<Void> deleteCity(@PathVariable String name) {
		if (cityService.deleteCity(name)) {
			return new ResponseEntity<>(HttpStatus.NO_CONTENT);
		} else {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
	}
}
