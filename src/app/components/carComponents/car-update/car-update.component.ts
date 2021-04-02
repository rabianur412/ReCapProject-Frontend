import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Brand } from 'src/app/models/brand';
import { Car } from 'src/app/models/car';
import { CarDetail } from 'src/app/models/car-detail';
import { Color } from 'src/app/models/color';
import { BrandService } from 'src/app/services/brand.service';
import { CarService } from 'src/app/services/car.service';
import { ColorService } from 'src/app/services/color.service';

@Component({
  selector: 'app-car-update',
  templateUrl: './car-update.component.html',
  styleUrls: ['./car-update.component.css']
})
export class CarUpdateComponent implements OnInit {
  carUpdateForm: FormGroup;
  currentCar: Car;
  brands:Brand[]=[]
  colors:Color[]=[]
  @Input() carForUpdate:CarDetail

  constructor(private formBuilder: FormBuilder,
              private carService: CarService,
              private toastrService: ToastrService,
              private brandService:BrandService,
              private colorService:ColorService) {
  }

  ngOnInit(): void {
    this.currentCar = this.getCurrentCar();
    console.log(this.carForUpdate)
    this.createCarUpdateForm();
    this.getBrands()
    this.getColors()
  }

  createCarUpdateForm() { 
    this.carUpdateForm = this.formBuilder.group({
      brandId: [this.carForUpdate?this.carForUpdate.brandId:'', Validators.required],
      colorId: [this.carForUpdate?this.carForUpdate.colorId: '', Validators.required],
      carName: [this.carForUpdate?this.carForUpdate.carName: '', Validators.required],
      modelYear: [this.carForUpdate?this.carForUpdate.modelYear:'', Validators.required],
      dailyPrice: [this.carForUpdate?this.carForUpdate.dailyPrice:'', Validators.required],
      description: [this.carForUpdate?this.carForUpdate.description:'', Validators.required]
    });
  }

  update() {
    let carModel:Car = Object.assign({}, this.carUpdateForm.value);
    carModel.Id=this.carForUpdate.carId
    this.carService.update(carModel).subscribe((response) => {
      this.toastrService.success(response.message);
    }, responseError => {
      console.log(responseError);
      this.toastrService.error(responseError.error.message);
    });
  } 
 
  getCurrentCar() {
    return this.carService.getCurrentCar();
  }
  
  getBrands(){
    this.brandService.getBrands().subscribe(response => {
      this.brands = response.data;
    })
  }

  getColors(){
    this.colorService.getColors().subscribe(response => {
      this.colors = response.data;
    })
  }
}