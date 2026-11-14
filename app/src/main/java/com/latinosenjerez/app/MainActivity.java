package com.latinosenjerez.app;
import android.app.Activity;
import android.os.Bundle;
import android.annotation.SuppressLint;
import android.content.Intent;
import android.net.Uri;
import android.webkit.WebChromeClient;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.CookieManager;
import android.webkit.ValueCallback;
import android.webkit.WebResourceError;
import android.graphics.Color;
import android.view.View;
import android.widget.FrameLayout;
import android.widget.TextView;
import android.content.ActivityNotFoundException;

public final class MainActivity extends Activity {
  private static final String HOME="https://suelafirme.github.io/Latinos-en-jerz/";
  private static final int SELECT_FILES=1234;
  private WebView web;
  private ValueCallback<Uri[]> fileCallback;

  @SuppressLint("SetJavaScriptEnabled")
  @Override public void onCreate(Bundle state){
    super.onCreate(state);
    getWindow().setStatusBarColor(Color.rgb(11,20,48));
    getWindow().setNavigationBarColor(Color.rgb(11,20,48));
    web=new WebView(this);
    web.setBackgroundColor(Color.rgb(249,250,253));
    web.setOverScrollMode(View.OVER_SCROLL_NEVER);
    web.setLayerType(View.LAYER_TYPE_HARDWARE,null);
    WebSettings s=web.getSettings();
    s.setJavaScriptEnabled(true);
    s.setUserAgentString(s.getUserAgentString()+" LatinosAndroid/4.0");
    s.setDomStorageEnabled(true);
    s.setDatabaseEnabled(true);
    s.setAllowFileAccess(false);
    s.setAllowContentAccess(true);
    s.setMixedContentMode(WebSettings.MIXED_CONTENT_NEVER_ALLOW);
    s.setSupportMultipleWindows(false);
    s.setJavaScriptCanOpenWindowsAutomatically(false);
    s.setMediaPlaybackRequiresUserGesture(true);
    s.setCacheMode(WebSettings.LOAD_DEFAULT);
    CookieManager.getInstance().setAcceptCookie(true);
    CookieManager.getInstance().setAcceptThirdPartyCookies(web,true);
    web.setWebViewClient(new WebViewClient(){
      @Override public boolean shouldOverrideUrlLoading(WebView v,WebResourceRequest req){
        return navigate(req.getUrl());
      }
      @Override public boolean shouldOverrideUrlLoading(WebView v,String url){
        return navigate(Uri.parse(url));
      }
      @Override public void onReceivedError(WebView view,WebResourceRequest request, WebResourceError error){
        if(request.isForMainFrame()) {
          view.loadDataWithBaseURL(null,"<html><meta name='viewport' content='width=device-width'><body style='background:#0b1730;color:white;font:18px sans-serif;padding:36px;text-align:center'><h2>LATINOS EN JEREZ</h2><p>No hay conexión. Comprueba Internet e inténtalo de nuevo.</p><p><a style='color:#ffb76a' href='"+HOME+"'>Reintentar</a></p></body></html>","text/html","UTF-8",null);
        }
      }
    });
    web.setWebChromeClient(new WebChromeClient(){
      @Override public boolean onShowFileChooser(WebView v, ValueCallback<Uri[]> callback, FileChooserParams params){
        if(fileCallback!=null)fileCallback.onReceiveValue(null);
        fileCallback=callback;
        Intent i=new Intent(Intent.ACTION_GET_CONTENT);
        i.addCategory(Intent.CATEGORY_OPENABLE);
        i.setType("image/*");
        i.putExtra(Intent.EXTRA_ALLOW_MULTIPLE,true);
        try {startActivityForResult(Intent.createChooser(i,"Seleccionar fotos"),SELECT_FILES);return true;}
        catch(Exception e){fileCallback=null;return false;}
      }
    });
    setContentView(web);
    web.loadUrl(HOME);
  }
  private boolean navigate(Uri uri){
    String scheme=uri.getScheme(),host=uri.getHost();
    if(scheme!=null && (scheme.equals("http")||scheme.equals("https"))&&("suelafirme.github.io".equals(host))){
      return false;
    }
    if(scheme!=null && (scheme.equals("https")||scheme.equals("http")||scheme.equals("mailto")||scheme.equals("tel")||scheme.equals("intent")||scheme.equals("whatsapp"))){
      try{startActivity(new Intent(Intent.ACTION_VIEW,uri));}catch(Exception ignored){}
      return true;
    }
    return false;
  }
  @Override protected void onActivityResult(int request,int result,Intent data){
    super.onActivityResult(request,result,data);
    if(request!=SELECT_FILES||fileCallback==null)return;
    Uri[] resultUris=null;
    if(result==RESULT_OK&&data!=null){
      if(data.getClipData()!=null){
        android.content.ClipData clip=data.getClipData();
        resultUris=new Uri[clip.getItemCount()];
        for(int i=0;i<clip.getItemCount();i++)resultUris[i]=clip.getItemAt(i).getUri();
      } else if(data.getData()!=null) resultUris=new Uri[]{data.getData()};
    }
    fileCallback.onReceiveValue(resultUris);fileCallback=null;
  }
  @Override public void onBackPressed(){
    if(web!=null&&web.canGoBack())web.goBack();
    else super.onBackPressed();
  }
  @Override protected void onDestroy(){if(fileCallback!=null){fileCallback.onReceiveValue(null);fileCallback=null;} if(web!=null)web.destroy();super.onDestroy();}
}
