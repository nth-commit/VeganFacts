import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ApiModule } from './api';
import { FactsModule, FactListComponent, FactListItemComponent, FactFormBulkComponent, FactFormComponent } from './facts';
import { SpinnerModule, SpinnerComponent } from './spinner';
import { TagsModule, TagListComponent, TagSelectorComponent } from './tags';
import { SourcesModule, SourceFormListComponent } from './sources';

@NgModule({
  imports: [
    CommonModule,
    ApiModule,
    FactsModule,
    SpinnerModule,
    TagsModule,
    SourcesModule
  ],
  exports: [
    FactListComponent, FactListItemComponent, FactFormBulkComponent, FactFormComponent,
    SpinnerComponent,
    TagListComponent, TagSelectorComponent,
    SourceFormListComponent
  ]
})
export class CoreModule { }
