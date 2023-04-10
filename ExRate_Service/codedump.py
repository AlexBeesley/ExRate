import os

def list_files(startpath):
    with open('file_contents.txt', 'w', encoding='utf-8') as output_file:
        for root, dirs, files in os.walk(startpath):
            for filename in files:
                if filename.endswith('.py'):
                    file_path = os.path.join(root, filename)
                    with open(file_path, 'r', encoding='utf-8', errors='ignore') as input_file:
                        output_file.write('---' * 10 + '\n')
                        output_file.write(f'{filename}\n')
                        output_file.write('---' * 10 + '\n')
                        output_file.write(input_file.read())
                        output_file.write('\n\n')

# replace 'path/to/folder' with the path to the folder you want to scan
list_files('C:\dev\ExRate\ExRate_Service')
