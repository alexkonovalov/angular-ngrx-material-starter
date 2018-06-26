import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { HttpErrorResponse } from '@angular/common/http';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { Store } from '@ngrx/store';

import { CoreModule } from '../../core';
import { SharedModule } from '../../shared';
import { TestStore } from '../../../testing/utils';

import { ExamplesModule } from '../examples.module';

import { StockMarketComponent } from './stock-market.component';
import { StockMarketState } from './stock-market.reducer';

describe('StockMarketComponent', () => {
  let component: StockMarketComponent;
  let fixture: ComponentFixture<StockMarketComponent>;
  let store: TestStore<StockMarketState>;
  
  const getSpinner = () =>
    fixture.debugElement.query(
      By.css('mat-spinner')
    );
  
  const getError = () =>
    fixture.debugElement.query(
      By.css('.error')
    );

  const getStocks = () =>
    fixture.debugElement.query(
      By.css('mat-card mat-card-title')
    );
  
  const getExchange = () =>
    fixture.debugElement.query(
      By.css('mat-card mat-card-content')
    );
  
  const getChange = () =>
    fixture.debugElement.query(
      By.css('mat-card mat-card-subtitle')
    );
  
  const getCaretUpDownItem = () =>
    fixture.debugElement.query(
      By.css('mat-card mat-icon[fontIcon="fa-caret-down"]')
    );


  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        imports: [
          RouterTestingModule,
          NoopAnimationsModule,
          CoreModule,
          SharedModule,
          ExamplesModule
        ],
        providers: [{ provide: Store, useClass: TestStore }]
      }).compileComponents();
    })
  );

  beforeEach(
    inject([Store], (testStore: TestStore<StockMarketState>) => {
      store = testStore;
      store.setState({ symbol: "string", loading: true });
      fixture = TestBed.createComponent(StockMarketComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should show spinner when stock are loading', () => {
    fixture.detectChanges();
    expect(getSpinner()).toBeTruthy();
  });

  it('should not show spinner when stocks are not loading', () => {
    store.setState({ symbol: 'TDD', loading: false });
    fixture.detectChanges();
    expect(getSpinner()).not.toBeTruthy();
  });

  it('should show error on retrieve stocks error', () => {
    store.setState({
      symbol: 'TDD', 
      loading: false,
      error: new HttpErrorResponse({})
    });

    fixture.detectChanges();
    expect(getError()).toBeTruthy();
  });

  describe('given stock details are loaded', () => {
    const symbol = 'TDD';
    const exchange = 'TESTAQ';
    const last = '123';
    const ccy = 'USD';
    const change = '100';
    const changePercent = '11';

    beforeEach(() => {
      store.setState({
        symbol, 
        loading: false,
        stock: {
          symbol,
          exchange,
          last,
          ccy,
          change,
          changePercent,
          changeNegative: true,
          changePositive: false
        },
      });

      fixture.detectChanges();
    });

    it('should display correct stock name, price, currency', () => {
      expect(getStocks().nativeElement.textContent.trim())
        .toEqual(`${symbol} ${last} ${ccy}`);
    });

    it('should display correct exchange', () => {
      expect(getExchange().nativeElement.textContent.trim())
        .toEqual(exchange);
    });

    it('should display correct change', () => {
      expect(getChange().nativeElement.textContent.trim())
        .toEqual(`${change} (${changePercent})`);
    });

    it('should display the relevant caret item', () => {
      expect(getCaretUpDownItem()).toBeTruthy();
    });
  });

});
