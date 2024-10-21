import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AnyCatcher } from 'rxjs/internal/AnyCatcher';

@Injectable({
  providedIn: 'root'
})
export class MyServiceService {
  url = "http://localhost/s2k/";
  apiUrl = "http://localhost:8000/api/";

  public post: any[] = [];
  public trans:any;

  constructor(private http: HttpClient) { }

  insertorder(idata: any, trackingNumber: string):Observable<any> {
    // Prepare the data payload for the API
    const data = {
        id: idata,                
        trackingNumber: trackingNumber,
        laundry: this.post,  
        Transac: this.trans
    };
    // Debugging: Check the payload before sending
    console.log('Payload:', data);
    this.post = [];
    console.log(data);
  
    // Send the data to the Laravel API using an HTTP POST request
    return this.http.post(this.apiUrl + 'transactions', data);  // Laravel API endpoint
  }

  register(data:any): Observable<any>{
    return this.http.post(this.apiUrl + 'register',data);
  }

  savesignup(sdata:any){
    return this.http.post(this.url + 'savesignup.php', JSON.stringify(sdata));
  }

  checklogin(ldata:any){
    return this.http.post(this.url + 'checklogin.php', JSON.stringify(ldata));
  }

  // showhis(gdata:any){
  //   return this.http.get(this.url + 'gethis.php?cust_id='+ gdata);
  // }

  showdetail(tid:any){
    return this.http.get(this.url + 'showdet.php?transac_id=' + tid);
  }

  getcustomerdata(data:any){
    return this.http.get(this.url + 'getcustomer.php?id=' + data);
  }

  updateuser(udata:any){
    return this.http.post(this.url + 'updateuser.php',JSON.stringify(udata));
  }

  gentracknum(){
    return this.http.get(this.url + 'tracknum.php');
  }

  getlatesttrans(lid:any){
    return this.http.get(this.url + 'getlatesttrans.php?cust_id=' + lid);
  }

  // updatetrans(udata:any){
  //   return this.http.post(this.url + 'updatetrans.php',JSON.stringify(udata));
  // }

  test(id:any){
    return this.http.get(this.url + 'test.php?trans_id=' + id);
  }

  cancelorder(id:any,idd:any){
    return this.http.get(`${this.url}cancelorder.php?transac_id=${id}&Transacdet_id=${idd}`);
  }

  // Update method to handle form data with image
  updateUserWithImage(formData: FormData) {
    return this.http.post(`api/updateCustomer.php`, formData);
  }






  //LARAVEL
  login(data:any): Observable<any>{
    return this.http.post(this.apiUrl + 'login',data);
  }

  updatetrans(udata:any): Observable<any>{
    return this.http.post(`${this.apiUrl}updatetrans`,udata);
  }

  display(id:any):Observable<any>{
    // return this.http.get(this.apiUrl + 'display');
    return this.http.get(`${this.apiUrl}display/${id}`);
  }

  getcustomer(id:any):Observable<any>{
    return this.http.get(`${this.apiUrl}getcustomer/${id}`)
  }

  getlist():Observable<any>{
    return this.http.get(`${this.apiUrl}getlist/`);
  }

  gettransdetail(transacId: number):Observable<any> {
    return this.http.get(`${this.url}gettransdetail.php/${transacId}`);
  }

  gethis(id:any):Observable<any>{
    return this.http.get(`${this.apiUrl}gethis/${id}`)
  }

  cancel(data: any){
    return this.http.get(`${this.apiUrl}cancelTrans/${data}`);
  }

  addtrans(data:any):Observable<any>{
    return this.http.post(`${this.apiUrl}addtrans`,data);
  }

  displayDet(data:any):Observable<any>{
    return this.http.get(`${this.apiUrl}displayDet/${data}`)
  }

  insertNewDetails(newEntries: { Categ_ID: number, Qty: number, Tracking_number: string }[]): Observable<any> {
    return this.http.post(`${this.apiUrl}insertDetails`,newEntries);
  }

  updateTransactionStatus(trackingNumber: string, transacStatus: string): Observable<any> {
    return this.http.post(`${this.apiUrl}insertDetails`,{ Tracking_number: trackingNumber, Transac_status: transacStatus });
  }

  updateCus(formData:FormData):Observable<any>{
    return this.http.post(`${this.apiUrl}updateCus`,formData);
  }

  deleteDetails(deletedEntries: number[]): Observable<any> {
    return this.http.delete(`${this.apiUrl}deleteDetails`, {
      body: { deletedEntries } 
    });
  }

  getTransId(id:any):Observable<any>{
    return this.http.get(`${this.apiUrl}getTransId/${id}`);
  }

  signup(id:any):Observable<any>{
    return this.http.post(`${this.apiUrl}signup`,id)
  }

  getDetails(id:any){
    return this.http.get(`${this.apiUrl}getDetails/${id}`);
  }

}
