import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

//import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MdIconModule } from '@angular/material';

import { TagsModule } from '../tags/tags.module';

import { FactListComponent } from './fact-list/fact-list.component';
import { FactListItemComponent } from './fact-list-item/fact-list-item.component';
import { FactFormBulkComponent } from './fact-form-bulk/fact-form-bulk.component';
import { FactFormComponent } from './fact-form/fact-form.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    //BrowserAnimationsModule,
    MdIconModule,
    TagsModule
  ],
  declarations: [
    FactListComponent,
    FactListItemComponent,
    FactFormBulkComponent,
    FactFormComponent
  ],
  exports: [
    FactListComponent,
    FactFormBulkComponent
  ]
})
export class FactsModule { }
