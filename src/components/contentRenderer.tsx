export const renderContent = (child: any) => {
    switch (child.type) {
      case 'paragraph':
        return `<p>${child.children[0]?.text ?? '</br>'}</p>`;
      case 'upload':
        return `<img src="${child.value.url}" width="${child.value.width}px" height="${child.value.height}px" alt="${child.value.filename}" class="rounded-lg mb-8" />`;
      case 'list': {
        const listItems = child.children
          .map((item: any, index: number) => {
            const text = item.children[0]?.text;
            const isChecked = item.checked ? 'checked' : '';
            const textStyle = item.checked ? 'text-decoration: line-through;' : '';
  
            return `<li key="${index}">
                      ${
                        child.listType === 'check'
                          ? `<input type="checkbox" ${isChecked} disabled />`
                          : ''
                      }
                      <span style="${textStyle}">${text}</span>
                    </li>`;
          })
          .join('');
  
        if (child.listType === 'number') {
          return `<ol style="list-style-type: decimal; margin-left: 15px">${listItems}</ol>`;
        }
        if (child.listType === 'bullet') {
          return `<ul style="list-style-type: disc; margin-left: 15px">${listItems}</ul>`;
        }
        if (child.listType === 'check') {
          return `<ul style="list-style-type: none; margin-left: 15px">${listItems}</ul>`;
        }
      }
      case 'quote':
        return `<blockquote><p>${child.children[0]?.text || 'Quote text'}</p></blockquote>`;
      case 'heading': {
        const text = child.children[0]?.text;
        let style = '';
  
        switch (child.tag) {
          case 'h1':
            style = 'font-size: 32px; margin-bottom: 10px; font-weight: bold;';
            break;
          case 'h2':
            style = 'font-size: 28px; margin-bottom: 8px; font-weight: bold;';
            break;
          case 'h3':
            style = 'font-size: 24px; margin-bottom: 8px; font-weight: bold;';
            break;
          case 'h4':
            style = 'font-size: 20px; margin-bottom: 8px; font-weight: bold;';
            break;
          case 'h5':
            style = 'font-size: 18px; margin-bottom: 8px; font-weight: bold;';
            break;
          case 'h6':
            style = 'font-size: 16px; margin-bottom: 8px; font-weight: bold;';
            break;
          default:
            style = '';
        }
  
        return `<${child.tag} style="${style}">${text}</${child.tag}>`;
      }
      case 'horizontalrule':
        return `<hr />`;
      default:
        return '';
    }
  };
  