import { Component, OnInit } from '@angular/core';

import { FactCreate } from '../../../../core/api';

@Component({
  selector: 'app-fact-preview-dialog',
  templateUrl: './fact-preview-dialog.component.html',
  styleUrls: ['./fact-preview-dialog.component.scss']
})
export class FactPreviewDialogComponent implements OnInit {

  fact: FactCreate;

  constructor() { }

  ngOnInit() {
  }

}