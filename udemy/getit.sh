!#/bin/sh
i=5
while [ $i -lt 172 ] ; do    
  mkdir l$i
  cd l$i
  pwd
  git clone https://github.com/iamshaunjp/modern-javascript.git -b lesson-$i
  cd ..
  i=$(expr $i + 1)
  echo $i
done

