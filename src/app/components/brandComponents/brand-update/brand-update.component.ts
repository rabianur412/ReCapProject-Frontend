import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Brand } from 'src/app/models/brand';
import { BrandService } from 'src/app/services/brand.service';

@Component({
  selector: 'app-brand-update',
  templateUrl: './brand-update.component.html',
  styleUrls: ['./brand-update.component.css']
})
export class BrandUpdateComponent implements OnInit {

  brandUpdateForm:FormGroup;
  brand:Brand;
  
  constructor(private activatedRoute:ActivatedRoute,private formBuilder:FormBuilder,private toastrService:ToastrService,private brandService:BrandService) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      if(params["brandId"]){
        this.getBrandById(params["brandId"]);
        this.createBrandUpdateForm();
      }
    });
  }
  createBrandUpdateForm(){
    this.brandUpdateForm=this.formBuilder.group({
    brandId:["",Validators.required],
     brandName:["",Validators.required]
    })
  }
  getBrandById(brandId:number) {
    this.brandService.getBrandById(brandId).subscribe(response => {
      this.brand = response.data;
    });
  }
  updateBrand(){
    this.brandUpdateForm.patchValue({ brandId: this.brand.brandId })
    if(this.brandUpdateForm.valid){
      let brandModel = Object.assign({},this.brandUpdateForm.value);
      this.brandService.update(brandModel).subscribe(
        response => {
        this.toastrService.success(response.message,"Successful")
        },
        responseError => {
        if(responseError.error.ValidationErrors.length > 0) {
          for(let i=0;i<responseError.error.ValidationErrors.length;i++) {
            this.toastrService.error(responseError.error.ValidationErrors[i].ErrorMessage,"Validation Error")
          }
        }
      })
    }
    else {
      this.toastrService.error("The form is missing.","Attention!")
    }
  }

}