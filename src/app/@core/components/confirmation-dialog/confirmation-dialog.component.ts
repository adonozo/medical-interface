import { Component, Input, OnInit } from '@angular/core';
import { NbDialogRef } from "@nebular/theme";

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.scss']
})
export class ConfirmationDialogComponent implements OnInit {
  @Input() title: string;
  @Input() message: string;
  @Input() confirmationButton: string;

  constructor(private dialogRef: NbDialogRef<ConfirmationDialogComponent>) { }

  ngOnInit(): void {
  }

  returnResult(result: boolean): void {
    this.dialogRef.close(result);
  }
}
