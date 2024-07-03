import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-confirm-modal',
  templateUrl: './confirm-modal.component.html',
  styleUrls: ['./confirm-modal.component.scss']
})
export class ConfirmModalComponent {
  @Input() isVisable!: boolean;
  @Input() message!: string;
  @Input() title!: string;
  @Input() confirmBtnText: string = 'Confirm';
  @Input() cancelBtnText: string = 'Cancel';

  @Output() confirm = new EventEmitter<boolean>();
  @Output() cancel = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit(): void {
  }

  delete() {
    this.confirm.emit(true);
    this.isVisable = false;
  }

  close() {
    this.isVisable = false;
    this.cancel.emit(false);
  }
}
