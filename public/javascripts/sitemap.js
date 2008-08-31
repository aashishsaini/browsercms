//This runs when the pages loads and applies various handlers to certain events. Unobtrusive JabbaScript FTW!
document.observe('dom:loaded', function() { 
    
  //First we find all spans
  $$('#sitemap span').each(function(e) {
    
    //Attach the mouseover/mouseout events
    e.observe('mouseover', function(){ $(this).addClassName('hover') });
    e.observe('mouseout', function(){ $(this).removeClassName('hover') });
    
    //Attach the click handler
    e.observe('click', function(event) {
      
      //Unselect all other pages/sections
      $$('#sitemap span').each(function(e) { e.removeClassName('selected') })
      
      //Disable All Buttons
      
      //Set actions and enable buttons where appropriate
      
      //Show this page as selected
      event.element().addClassName('selected');
      
    });
    
  });

  //Now make all the list items draggable
  $$('#sitemap li').each(function(e){
    new Draggable(e, {revert: true });    
  });
  
  //Make all the section links and labels droppable
  $$('#sitemap span.section').each(function(e){
    Droppables.add(e, {
      hoverclass: 'drop-target',
      onDrop: function(e) {
        if(e != this.element.up()) {
          
          //Figure out the id of the page/section
          if(e.hasClassName('page')) {
            url = '/cms/pages/'+e.id.sub('page_','');
          } else if(e.hasClassName('section')) {
            url = '/cms/sections/'+e.id.sub('section_','');
          } else {
            return; //WTF?
          }
          
          //Figure out section we are moving to
          section = this.element.up();
          
          //Let the server know about the move
          url += '/move_to/'+section.id.sub('section_','')+'.js';
          new Ajax.Request(url, {method: 'put'});

          //Open the section and put the page/section into it
          list = section.down('ul');
          list.show();
          section.down('img').src = '/images/cms/icons/actions/folder_open.png';
          list.appendChild(e);  
          e.setStyle({'z-index': 0, top: 0, left: 0});
        }
      }
    });    
  });
  
  //Attach click handlers to the icons
  $$('#sitemap a.section').each(function(e){
    e.observe('click', function(event){ 
      parent = event.element().up().up();
      list = parent.down('ul');
      list.toggle();
      if(list.visible()) {
        parent.down('img').src = '/images/cms/icons/actions/folder_open.png';
      } else {
        parent.down('img').src = '/images/cms/icons/actions/folder.png';
      }
    })
  });
  
});